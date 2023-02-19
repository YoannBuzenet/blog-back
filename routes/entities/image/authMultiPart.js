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
const { slugify } = require("../../../services/utils");

module.exports = function (fastify, opts, done) {
  

  

  // TODO later : google quel type de schema peut accepter un formdata multipart (car si je met type:object, les request sont refusées)
  fastify.post(
    "/",
    {
      schema: {
        body: {
          required: [
            "name",
            "credits",
            "image",
            "UserId",
            "token",
            "provider",
          ],
          properties: {
            // name: { type: "string" },
            // credits: { type: "string" },
            // language: { type: "string" },
            // x: { type: "string" },
            // y: { type: "string" },
            // height: { type: "string" },
            // UserId: { type: "string" },
            // token: { type: "string" },
            // provider: { type: "string" },
            // tags: {
            //   type: "array",
            //   items: {
            //     type: "object",
            //   },
            // },
          },
        },
      },
    },
    async (req, reply) => {
      console.log(" -------- REQ RECUE :O -----------");
      const data = await req.body;

      console.log("REQ RECUE",data);

      // Check des données d'auth
      // On ne peut les mettre dans un middleware hook car il faut accéder à req.file() d'abord
      // Ou alors un hook spécifique au multipart ?
    
      if (!data.token.value || !data.provider.value || !data.UserId.value) {
        reply.code(400).send("Bad Request.");
        return;
      }

      const isUserLogged = db.User.isAuthenticated(data.UserId.value, data.token.value, data.provider.value);

      if (!isUserLogged) {
        reply.code(401).send("Unauthorized");
        return;
      }

      const buf = await data.image.toBuffer();

      const imageNameEncoded = slugify(data.name.value);

      try {
        //  edit and save the file
        let pathImage = path.join(
          FOLDER_IMAGE,
          `${imageNameEncoded}.${DEFAULT_FORMAT_IMAGE}`
        );
        const didCropImage = await cropImage(
          buf,
          data.x.value,
          data.y.value,
          data.width.value,
          data.height.value,
          imageNameEncoded,
          DEFAULT_FORMAT_IMAGE
        );

        if (didCropImage) {
          // save the image

          // if it worked, save the image record
          const newImage = {
            name: `${imageNameEncoded}.${DEFAULT_FORMAT_IMAGE}`,
            credits: data?.credits?.value,
            language: data?.language?.value || FRENCH_LOCALE,
            path: pathImage,
          };

          let arrayOfTagsID = [];
          if (data?.tags?.value) {
            const tags = JSON.parse(data?.tags?.value);
            console.log("they are tags to set", tags);

            // All tags must be registered in DB before being indicated in Image association
            if (Array.isArray(tags)) {
              for (let i = 0; i < tags.length; i++) {
                //A new tag holds the prop isNewTag
                if (tags[i].__isNew__) {
                  const tag = await db.Tag.create({name : tags[i].label, language: data?.language?.value || FRENCH_LOCALE});
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
        logger.log("error", "Error while creating a Image :" + e + e.stack);
        reply.code(500).send("Error when creating a image");
      }
      return;
    }
  );


  done();
};
