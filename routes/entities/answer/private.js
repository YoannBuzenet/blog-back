const { logger } = require("../../../logger");
const db = require("../../../models/index");
const { isComingFromBlog } = require("../../../services/authControl");

// Private endpoints for next blog-front only.

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
        const { sort, limit } = req.query;

        // On récupère toutes les propriétés du modèle pour filtrer les éventuels filtres reçus en query param
        const allPropertiesFromAnswer = Object.keys(db.Answer.rawAttributes);

        // Préparer la requete
        let filters = {};

        if (allPropertiesFromAnswer.includes(sort)) {
          filters.order = [[sort, "DESC"]];
        }
        if (limit && +limit < MAX_PAGINATION) {
          filters.limit = +limit;
        } else {
          filters.limit = MAX_PAGINATION;
        }

        const answer = await db.Answer.findAll(filters);

        reply.code(200).send(answer);
      } catch (error) {
        logger.log("error", "Error while searching for all Answers :" + error);
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
        const answer = await db.Answer.findOne({
          where: {
            id: req.params.id,
          },
        });
        if (answer) {
          reply.code(200).send(answer);
        } else {
          reply.code(404).send("answer non trouvé.");
        }
      } catch (error) {
        logger.log("error", "Error while searching for all Answers :" + error);
        reply.code(500).send(error);
      }

      return;
    }
  );

  done();
};
