const path = require("path");
const { logger } = require("../../logger");
const db = require("../../models/index");
const { isComingFromBlog } = require("../../services/authControl");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/login-and-register-if-needed",
    {
      schema: {
        body: {
          type: "object",
          required: ["provider", "user"],
          properties: {
            provider: { type: "string" },
            user: { type: "object" },
          },
        },
      },
    },
    async (req, reply) => {
      // This endpoint is coded to work with google auth only for now.
      if (req.body.provider === "google") {
        // Checking if user already exists
        const userToFind = await db.User.findOne({
          where: {
            googleId: req.body.user.googleId,
          },
        });

        const userToFindByMail = await db.User.findOne({
          where: {
            email: req.body.user.email,
          },
        });

        let userToReturn;

        if (userToFind !== null) {
          // If user with google id already exists, we just update its token and relevant infos
          const userToUpdate = await db.User.updateTokenFromGoogle(
            userToFind,
            req.body.user
          );
          userToReturn = userToUpdate[0];
        } else if (userToFindByMail !== null) {
          // If user with same email already exists, we just update its token and relevant infos
          await db.User.updateExistingProfileWithGoogleAccount(
            userToFindByMail,
            req.body.user
          );

          userToReturn = userToFindByMail;
        } else {
          // If user doesn't exit in db, we register it
          try {
            const userCreated = await db.User.registerFromGoogle(req.body.user);

            userToReturn = userCreated;
          } catch (e) {
            console.error("error when registering user from google", e);
          }
        }

        // Final Reply
        reply
          .code(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .send(userToReturn);
        return;
      } else {
        reply.code(406).send("Provider not handled.");
        return;
      }
    }
  );

  //TODO later : paginer
  fastify.get(
    "/",
    {
      schema: {},
    },
    async (req, reply) => {
      const isRequestAuthorized = isComingFromBlog(req.headers);

      if (!isRequestAuthorized) {
        reply.code(401).send("Unauthorized");
        return;
      }

      try {
        const users = await db.User.findAll({ include: [db.Answer] });

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
      const isRequestAuthorized = isComingFromBlog(req.headers);

      if (!isRequestAuthorized) {
        reply.code(401).send("Unauthorized");
        return;
      }

      try {
        const user = await db.User.findOne({
          where: {
            id: req.params.id,
          },
        });
        reply.code(200).send(user);
      } catch (error) {
        logger.log("error", "Error while searching for user by id :" + error);
        reply.code(500).send(error);
      }

      return;
    }
  );

  fastify.get(
    "/email/:email",
    {
      schema: {},
    },
    async (req, reply) => {
      const isRequestAuthorized = isComingFromBlog(req.headers);

      if (!isRequestAuthorized) {
        reply.code(401).send("Unauthorized");
        return;
      }

      try {
        const user = await db.User.findOne({
          where: {
            email: req.params.email,
          },
          include: [db.Answer],
        });
        reply.code(200).send(user);
      } catch (error) {
        logger.log("error", "Error while searching for user by mail :" + error);
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
        },
      },
    },
    async (req, reply) => {
      const isRequestAuthorized = isComingFromBlog(req.headers);

      if (!isRequestAuthorized) {
        reply.code(401).send("Unauthorized");
        return;
      }

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
      const isRequestAuthorized = isComingFromBlog(req.headers);

      if (!isRequestAuthorized) {
        reply.code(401).send("Unauthorized");
        return;
      }

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

  // Get User by access Token
  fastify.get(
    "/googleId/:googleId",
    {
      type: "object",
      properties: {
        googleId: { type: "number" },
      },
    },
    async (req, reply) => {
      const isRequestAuthorized = isComingFromBlog(req.headers);

      if (!isRequestAuthorized) {
        reply.code(401).send("Unauthorized");
        return;
      }

      // Checking if user already exists
      const userToFind = await db.User.findOne({
        where: {
          googleId: req.params.googleId,
        },
        include: [db.Answer],
      });

      if (userToFind === null) {
        reply.code(406).send("User doesnt exist.");
        return;
      }

      reply.send(userToFind);
      return;
    }
  );

  done();
};
