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
        const posts = await db.Post.findAll();

        reply.code(200).send(posts);
      } catch (error) {
        logger.log("error", "Error while searching for all Posts :" + error);
        reply.code(500).send(error);
      }
      return;
    }
  );

  fastify.get(
    "/byId/:id",
    {
      schema: {},
    },
    async (req, reply) => {
      try {
        const post = await db.Post.findOne({
          where: {
            id: req.params.id,
          },
        });
        reply.code(200).send(post);
      } catch (error) {
        logger.log("error", "Error while searching for all Posts :" + error);
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

        reply.code(200).send(Post);
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
          required: ["title", "shortDescription", "content", "UserId"],
          properties: {
            title: { type: "string" },
            shortDescription: { type: "string" },
            content: { type: "string" },
            UserId: { type: "integer" },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const newPost = {
          title: req.body.title,
          shortDescription: req.body.shortDescription,
          content: req.body.content,
          UserId: req.body.UserId,
        };

        const savedPost = await db.Post.create(newPost);

        reply.code(200).send(savedPost);
        return;
      } catch (e) {
        logger.log("error", "Error while creating a Post :" + e);
        reply.code(500).send("Error when creating a post");
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
