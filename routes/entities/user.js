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
        const users = await db.User.findAll();

        reply.code(200).send(users);
      } catch (error) {
        logger.log("error", "Error while searching for all Users :" + error);
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
        const user = await db.User.findOne({
          where: {
            id: req.params.id,
          },
        });
        reply.code(200).send(user);
      } catch (error) {
        logger.log("error", "Error while searching for all Users :" + error);
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

        reply.code(200).send(User);
        return;
      } catch (e) {
        logger.log("error", "Error while searching forUser : " + e);
        reply.code(500).send("Error when editing a user");
      }
    }
  );
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
        const newUser = {
          name: req.body.name,
        };

        const savedUser = await db.User.create(newUser);

        reply.code(200).send(savedUser);
        return;
      } catch (e) {
        logger.log("error", "Error while creating a User :" + e);
        reply.code(500).send("Error when creating a user");
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
