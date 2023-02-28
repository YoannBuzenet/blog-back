const path = require("path");
const { MAX_PAGINATION } = require("../../../config/consts");
const { logger } = require("../../../logger");
const db = require("../../../models/index");
const { isComingFromBlog } = require("../../../services/authControl");

module.exports = function (fastify, opts, done) {
  fastify.addHook("preHandler", (request, reply, done) => {
    const isRequestAuthorized = isComingFromBlog(request.headers);

    if (!isRequestAuthorized) {
      reply.code(401).send("Unauthorized");
      return;
    }
    done();
  });

  fastify.get(
    "/",
    {
      schema: {},
    },
    async (req, reply) => {
      try {
        const { sortBy, limit, language } = req.query;

        // On récupère toutes les propriétés du modèle pour filtrer les éventuels filtres reçus en query param
        const allPropertiesFromPost = Object.keys(db.Post.rawAttributes);

        // Préparer la requete
        let filters = {};

        if (allPropertiesFromPost.includes(sortBy)) {
          filters.order = [[sortBy, "DESC"]];
        }
        if (limit && +limit < MAX_PAGINATION) {
          filters.limit = +limit;
        } else {
          filters.limit = MAX_PAGINATION;
        }

        filters.where = {}

        if (language) {
          filters.where = { language: language };
        }

        // On omet les posts ispublished : false
          filters.where.isPublished = true;
        // On omet les posts fait pour d'autres usages que le feed
          filters.where.isOutOfPostFeed = false;

          filters.include = [{
            model: db.Post,
            as: "Sibling",
          }, {
            model : db.Tag,
          }]


        const posts = await db.Post.findAll(filters);

        reply.code(200).send(posts);
      } catch (error) {
        logger.log("error", "Error while searching for all Posts :" + error);
        reply.code(500).send(error);
      }
      return;
    }
  );

  done();
};
