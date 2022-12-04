const path = require("path");
const { logger } = require("../../../logger");
const db = require("../../../models/index");

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
      const user = await db.User.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        // change object, save it
        for (const prop in req.body) {
          user[prop] = req.body[prop];
        }

        const savedUser = await user.save();

        reply.code(200).send(savedUser);
        return;
      } catch (e) {
        logger.log("error", "Error while editing user : " + e);
        reply.code(500).send("Error when editing a user");
      }
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
            UserId: { type: "string" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const user = await db.User.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        //Delete
        const deletedUser = await user.destroy();
        reply.code(200).send(deletedUser.dataValues);

        return;
      } catch (e) {
        logger.log("error", "Error while deleting user :" + e);
        reply.code(500).send("Error when editing a user");
      }
    }
  );

  done();
};
