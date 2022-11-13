const path = require("path");
const { MAX_PAGINATION } = require("../../../config/consts");
const { ENGLISH_LOCALE } = require("../../../i18n/consts");
const { logger } = require("../../../logger");
const db = require("../../../models/index");

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
        const { sortBy, limit, language = ENGLISH_LOCALE } = req.query;

        // On récupère toutes les propriétés du modèle pour filtrer les éventuels filtres reçus en query param
        const allPropertiesFromTag = Object.keys(db.Tag.rawAttributes);

        // Préparer la requete
        let filters = {};

        if (allPropertiesFromTag.includes(sortBy)) {
          filters.order = [[sortBy, "DESC"]];
        }
        if (limit && +limit < MAX_PAGINATION) {
          filters.limit = +limit;
        } else {
          filters.limit = MAX_PAGINATION;
        }

        filters.where = {};
        filters.where.language = language;

        const tag = await db.Tag.findAll(filters);

        reply.code(200).send(tag);
      } catch (error) {
        logger.log("error", "Error while searching for all Tags :" + error);
        reply.code(500).send(error);
      }
      return;
    }
  );

  fastify.get(
    "/:id",
    {
      schema: {},
    },
    async (req, reply) => {
      try {
        const tag = await db.Tag.findOne({
          where: {
            id: req.params.id,
          },
        });
        if (tag) {
          reply.code(200).send(tag);
        } else {
          reply.code(404).send("tag non trouvé.");
        }
      } catch (error) {
        logger.log("error", "Error while searching for all Tags :" + error);
        reply.code(500).send(error);
      }

      return;
    }
  );

  done();
};
