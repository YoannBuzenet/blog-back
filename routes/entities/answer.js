const path = require("path");
const { logger } = require("../../logger");
const db = require("../../models/index");

module.exports = function (fastify, opts, done) {
  // TO DO : Add auth middleware

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

  fastify.get(
    "/posts/:id",
    {
      schema: {},
    },
    async (req, reply) => {
      try {
        const answer = await db.Answer.findAll({
          where: {
            PostId: req.params.id,
          },
          include: {
            model: db.User,
            attributes: ["id", "nickname"],
          },
        });

        // Removing all props but the one we want from user objects

        if (answer) {
          reply.code(200).send(answer);
        } else {
          reply.code(404).send("answers non trouvées.");
        }
      } catch (error) {
        logger.log(
          "error",
          "Error while searching for all Answers for one post:" + error
        );
        reply.code(500).send(error);
      }

      return;
    }
  );

  fastify.put(
    "/:id",
    {
      schema: {
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const answer = await db.Answer.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        // change object, save it
        for (const prop in req.body) {
          answer[prop] = req.body[prop];
        }

        const savedAnswer = await answer.save();

        reply.code(200).send(savedAnswer);
        return;
      } catch (e) {
        logger.log("error", "Error while searching forAnswer : " + e);
        reply.code(500).send("Error when editing a answer");
      }
    }
  );

  // TODO Vérifier que la réponse parente est bien sur le même post
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const newAnswer = {
          name: req.body.name,
        };

        const savedAnswer = await db.Answer.create(newAnswer);

        reply.code(200).send(savedAnswer);
        return;
      } catch (e) {
        logger.log("error", "Error while creating a Answer :" + e);
        reply.code(500).send("Error when creating a answer");
      }
      return;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        body: {},
      },
    },
    async (req, reply) => {
      const answer = await db.Answer.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        //Delete
        const deletedAnswer = await answer.destroy();
        reply.code(200).send(deletedAnswer.dataValues);

        return;
      } catch (e) {
        logger.log("error", "Error while deleting answer :" + e);
        reply.code(500).send("Error when editing a answer");
      }
    }
  );

  done();
};
