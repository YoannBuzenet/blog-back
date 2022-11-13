const path = require("path");
const { MAX_PAGINATION } = require("../../../config/consts");
const { logger } = require("../../../logger");
const db = require("../../../models/index");

module.exports = function (fastify, opts, done) {
  fastify.addHook("preHandler", (request, reply, done) => {
    const { userID, token, provider } = req.body;

    if (!token || !provider || !userID) {
      reply.code(400).send("Bad Request.");
      return;
    }

    const isUserLogged = db.User.isAuthenticated(userID, token, provider);

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
          required: ["UserId", "token", "provider"],
          type: "object",
          properties: {
            UserId: { type: "number" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const post = await db.Post.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        // change object, save it
        for (const prop in req.body) {
          post[prop] = req.body[prop];
        }

        const savedPost = await post.save();

        reply.code(200).send(savedPost);
        return;
      } catch (e) {
        logger.log("error", "Error while searching forPost : " + e);
        reply.code(500).send("Error when editing a post");
      }
    }
  );
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: [
            "title",
            "shortDescription",
            "content",
            "metaDescription",
            "UserId",
            "token",
            "provider",
          ],
          properties: {
            title: { type: "string" },
            shortDescription: { type: "string" },
            content: { type: "string" },
            UserId: { type: "integer" },
            metaDescription: { type: "string" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const newPost = {
          title: req.body.title,
          shortDescription: req.body.shortDescription,
          metaDescription: req.body.metaDescription,
          isScoop: req.body.isScoop,
          content: req.body.content,
          UserId: req.body.UserId,
        };

        const savedPost = await db.Post.create(newPost);

        reply.code(200).send(savedPost);
        return;
      } catch (e) {
        logger.log("error", "Error while creating a Post :" + e);
        reply.code(500).send("Error when creating a post" + e);
        //TODO ajouter un parseur d'erreurs pour redonner les bonnes au front
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
      const post = await db.Post.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        //Delete
        const deletedPost = await post.destroy();
        reply.code(200).send(deletedPost.dataValues);

        return;
      } catch (e) {
        logger.log("error", "Error while deleting post :" + e);
        reply.code(500).send("Error when editing a post");
      }
    }
  );

  done();
};
