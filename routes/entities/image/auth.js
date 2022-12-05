const path = require("path");
const { cropImage } = require("../../../controllers/image");
const { logger } = require("../../../logger");
const db = require("../../../models/index");
const consumers = require("node:stream/consumers");
const {
  MAX_PAGINATION,
  FOLDER_IMAGE,
  DEFAULT_FORMAT_IMAGE,
} = require("../../../config/consts");
const { FRENCH_LOCALE } = require("../../../i18n/consts");
const fs = require("fs");

module.exports = function (fastify, opts, done) {
  fastify.addHook("preHandler", (request, reply, done) => {

    console.log("req reçue", request);
    console.log("req.body", request.body);

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
          required: ["name", "UserId", "token", "provider"],
          properties: {
            name: { type: "string" },
            UserId: { type: "number" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const image = await db.Image.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        // change object, save it
        for (const prop in req.body) {
          image[prop] = req.body[prop];
        }

        const savedImage = await image.save();

        reply.code(200).send(savedImage);
        return;
      } catch (e) {
        logger.log("error", "Error while searching forImage : " + e);
        reply.code(500).send("Error when editing a image");
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
            UserId: { type: "number" },
            token: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      const image = await db.Image.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        //Delete
        const deletedImage = await image.destroy();
        reply.code(200).send(deletedImage.dataValues);

        return;
      } catch (e) {
        logger.log("error", "Error while deleting image :" + e);
        reply.code(500).send("Error when editing a image");
      }
    }
  );

  done();
};
