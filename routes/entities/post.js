const path = require("path");
const { MAX_PAGINATION } = require("../../config/consts");
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
        const allPropertiesFromPost = Object.keys(db.Post.rawAttributes);

        // Préparer la requete
        let filters = {};

        if (allPropertiesFromPost.includes(sort)) {
          filters.order = [[sort, "DESC"]];
        }
        if (limit && +limit < MAX_PAGINATION) {
          filters.limit = +limit;
        } else {
          filters.limit = MAX_PAGINATION;
        }

        const posts = await db.Post.findAll(filters);

        reply.code(200).send(posts);
      } catch (error) {
        logger.log("error", "Error while searching for all Posts :" + error);
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
        const post = await db.Post.findOne({
          where: {
            id: req.params.id,
          },
        });
        if (post) {
          reply.code(200).send(post);
        } else {
          reply.code(404).send("Post non trouvé.");
        }
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
          properties: {},
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
          ],
          properties: {
            title: { type: "string" },
            shortDescription: { type: "string" },
            content: { type: "string" },
            UserId: { type: "integer" },
            metaDescription: { type: "string" },
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
