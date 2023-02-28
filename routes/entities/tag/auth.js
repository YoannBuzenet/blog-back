const path = require("path");
const { MAX_PAGINATION } = require("../../../config/consts");
const { ENGLISH_LOCALE } = require("../../../i18n/consts");
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
          required: ["name", "language", "UserId", "token", "provider"],
          properties: {
            name: { type: "string" },
            language: { type: "string" },
            UserId: { type: "string" },
            usedFor : {type: "string"},
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const tag = await db.Tag.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        // change object, save it
        for (const prop in req.body) {
          tag[prop] = req.body[prop];
        }

        const savedTag = await tag.save();

        reply.code(200).send(savedTag);
        return;
      } catch (e) {
        logger.log("error", "Error while searching forTag : " + e);
        reply.code(500).send("Error when editing a tag");
      }
    }
  );
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "language", "UserId", "token", "provider"],
          properties: {
            name: { type: "string" },
            language: { type: "string" },
            UserId: { type: "string" },
            usedFor : {type: "string"},
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        const newTag = {
          name: req.body.name,
          language: req.body.language,
          color_hexcode: req.body?.color_hexcode,
          usedFor: req.body?.usedFor
        };

        const savedTag = await db.Tag.create(newTag);

        reply.code(200).send(savedTag);
        return;
      } catch (e) {
        logger.log("error", "Error while creating a Tag :" + e);
        reply.code(500).send("Error when creating a tag");
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
      const tag = await db.Tag.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        //Delete
        const deletedTag = await tag.destroy();
        reply.code(200).send(deletedTag.dataValues);

        return;
      } catch (e) {
        logger.log("error", "Error while deleting tag :" + e);
        reply.code(500).send("Error when editing a tag");
      }
    }
  );

  done();
};
