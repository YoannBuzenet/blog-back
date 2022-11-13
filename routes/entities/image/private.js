const path = require("path");
const { cropImage } = require("../../controllers/image");
const { logger } = require("../../logger");
const db = require("../../models/index");
const consumers = require("node:stream/consumers");
const {
  MAX_PAGINATION,
  FOLDER_IMAGE,
  DEFAULT_FORMAT_IMAGE,
} = require("../../config/consts");
const { FRENCH_LOCALE } = require("../../i18n/consts");
const fs = require("fs");

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
        const { sortBy, limit, tags, language } = req.query;

        // On récupère toutes les propriétés du modèle pour filtrer les éventuels filtres reçus en query param
        const allPropertiesFromImage = Object.keys(db.Image.rawAttributes);

        // Préparer la requete
        let filters = {};

        if (allPropertiesFromImage.includes(sortBy)) {
          filters.order = [[sortBy, "DESC"]];
        }
        if (limit && +limit < MAX_PAGINATION) {
          filters.limit = +limit;
        } else {
          filters.limit = MAX_PAGINATION;
        }

        if (language) {
          filters.where = { language };
        } else {
          filters.where = { language: "All" };
        }

        // We add the tags
        filters.include = [{ model: db.Tag }];

        //TODO gérer plusieurs tags (là ça ne marche qu'avec un)
        if (tags) {
          filters.include[0].where = { name: tags };
        }

        const image = await db.Image.findAll(filters);

        reply.code(200).send(image);
      } catch (error) {
        logger.log("error", "Error while searching for all Images :" + error);
        reply.code(500).send(error);
      }
      return;
    }
  );

  done();
};
