const path = require("path");
const { MAX_PAGINATION } = require("../../../config/consts");
const { ENGLISH_LOCALE } = require("../../../i18n/consts");
const { logger } = require("../../../logger");
const db = require("../../../models/index");
const { isComingFromBlog } = require("../../../services/authControl");

module.exports = function (fastify, opts, done) {
  fastify.get(
    "/",
    {
      schema: {},
    },
    async (req, reply) => {
      try {
        const { sortBy, limit, language, usedFor } = req.query;

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
        if(language){
          filters.where.language = language;
        }

        if(usedFor){
          filters.where.usedFor = usedFor;
        }

        const tag = await db.Tag.findAll(filters);

        reply.code(200).send(tag);
      } catch (error) {
        logger.log("error", "Error while searching for all Tags :" + error);
        reply.code(500).send(error);
      }
      return;
    }
  );

  done();
};
