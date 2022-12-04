const { logger } = require("../../../logger");
const db = require("../../../models/index");
const { belongsToRelevantUser } = require("../../../services/authControl");

module.exports = function (fastify, opts, done) {
  fastify.addHook("preHandler", (request, reply, done) => {
    const { UserId, token, provider } = request.body;

    if (!token || !provider || !UserId) {
      reply.code(400).send("Bad Request.");
      return;
    }

    const isUserLogged = db.User.isAuthenticated(UserId, token, provider);

    if (!isUserLogged) {
      reply.code(401).send("Unauthorized");
      return;
    }
    done();
  });

  fastify.put(
    "/:id",
    {
      schema: {
        body: {
          type: "object",
          required: ["UserId", "token", "provider"],
          properties: {
            UserId: { type: "string" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const { UserId } = req.body;
      const isUserAdmin = db.User.isAdmin(UserId);

      const answer = await db.Answer.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!answer) {
        reply.code(404).send();
        return;
      }

      const isUserOwnerOfContent = belongsToRelevantUser(
        UserId,
        answer.dataValues.UserId
      );

      if (!isUserOwnerOfContent || !isUserAdmin) {
        reply.code(401).send();
        return;
      }

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

  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["content", "UserId", "PostId", "token", "provider"],
          properties: {
            content: { type: "string" },
            UserId: { type: "number" },
            PostId: { type: "number" },
            ParentAnswerId: { type: "number" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      console.log('CALL RECU')
      try {
        const newAnswer = {
          content: req.body.content,
          UserId: req.body.UserId,
          PostId: req.body.PostId,
          ParentAnswerId: req.body.ParentAnswerId,
        };

        // If we get a parent answer ID, we check for integrity that the parent answer is about the same post
        if (req.body.ParentAnswerId) {
          const isIntegrityOK = await db.Answer.isSamePost(
            req.body.ParentAnswerId,
            req.body.PostId
          );
          if (!isIntegrityOK) {
            reply
              .code(400)
              .send(
                "Bad Request. The Post Id of the parent answer doesn't match its child."
              );
            return;
          }
        }

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
        body: {
          type: "object",
          required: ["UserId", "token", "provider"],
          properties: {
            UserId: { type: "number" },
            token: { type: "string" },
            provider: { type: "string" },
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
