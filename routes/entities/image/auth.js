const path = require("path");
const { cropImage } = require("../../controllers/image");
const { logger } = require("../../logger");
const db = require("../../models/index");
const consumers = require("node:stream/consumers");
const {
  MAX_PAGINATION,
  FOLDER_IMAGE,
  DEFAULT_FORMAT_IMAGE,
} = require("../../config/consts");
const { FRENCH_LOCALE } = require("../../i18n/consts");
const fs = require("fs");

module.exports = function (fastify, opts, done) {
  fastify.addHook("preHandler", (request, reply, done) => {
    const { userID, token, provider } = request.body;

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
  // TODO later : google quel type de schema peut accepter un formdata multipart (car si je met type:object, les request sont refusées)
  fastify.post(
    "/",
    {
      schema: {
        body: {
          required: [
            "name",
            "credits",
            "language",
            "image",
            "UserId",
            "token",
            "provider",
          ],
          properties: {
            name: { type: "string" },
            credits: { type: "string" },
            language: { type: "string" },
            x: { type: "string" },
            y: { type: "string" },
            height: { type: "string" },
            width: { type: "string" },
            UserId: { type: "number" },
            token: { type: "string" },
            provider: { type: "string" },
            tags: {
              type: "array",
              items: {
                type: "object",
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      console.log(" -------- REQ RECUE -----------");
      const data = await req.file();
      console.log("data image", data);

      const buf = await consumers.buffer(data.file);

      try {
        //  edit and save the file
        let pathImage = path.join(
          FOLDER_IMAGE,
          `${data.fields.name.value}.${DEFAULT_FORMAT_IMAGE}`
        );
        const didCropImage = await cropImage(
          buf,
          data.fields.x.value,
          data.fields.y.value,
          data.fields.width.value,
          data.fields.height.value,
          data.fields.name.value,
          DEFAULT_FORMAT_IMAGE
        );

        if (didCropImage) {
          // save the image

          // if it worked, save the image record
          const newImage = {
            name: `${data.fields.name.value}.${DEFAULT_FORMAT_IMAGE}`,
            credits: data?.fields?.credits?.value,
            language: data?.fields?.language?.value || FRENCH_LOCALE,
            path: pathImage,
          };

          let arrayOfTagsID = [];
          if (data?.fields?.tags?.value) {
            const tags = JSON.parse(data?.fields?.tags?.value);
            console.log("they are tags to set", tags);

            // All tags must be registered in DB before being indicated in Image association
            if (Array.isArray(tags)) {
              for (let i = 0; i < tags.length; i++) {
                //A new tag holds the prop isNewTag
                if (tags[i].isNewTag) {
                  const tag = await db.Tag.create(tags[i]);
                  arrayOfTagsID = [...arrayOfTagsID, tag.dataValues.id];
                } else {
                  arrayOfTagsID = [...arrayOfTagsID, tags[i].id];
                }
              }
            }

            console.log("arrayOfTagsID", arrayOfTagsID);
          }

          const savedImage = await db.Image.create(newImage);

          // Passing array of tag ids
          const imageWithTags = await savedImage.setTags(arrayOfTagsID);

          reply.code(200).send(imageWithTags);
        } else {
          reply.code(500).send("Image could not be created.");
        }

        return;
      } catch (e) {
        logger.log("error", "Error while creating a Image :" + e);
        reply.code(500).send("Error when creating a image");
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
