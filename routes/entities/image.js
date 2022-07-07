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
        const { sort, limit } = req.query;

        // On récupère toutes les propriétés du modèle pour filtrer les éventuels filtres reçus en query param
        const allPropertiesFromImage = Object.keys(db.Image.rawAttributes);

        // Préparer la requete
        let filters = {};

        if (allPropertiesFromImage.includes(sort)) {
          filters.order = [[sort, "DESC"]];
        }
        if (limit && +limit < MAX_PAGINATION) {
          filters.limit = +limit;
        } else {
          filters.limit = MAX_PAGINATION;
        }

        const image = await db.Image.findAll(filters);

        reply.code(200).send(image);

      } catch (error) {
        logger.log("error", "Error while searching for all Images :" + error);
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
        const image = await db.Image.findOne({
          where: {
            id: req.params.id,
          },
        });
        if (image) {
          reply.code(200).send(image);
        } else {
          reply.code(404).send("image non trouvé.");
        }
      } catch (error) {
        logger.log("error", "Error while searching for all Images :" +error);
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
        logger.log("error", "Error while searching forImage : "+e);
        reply.code(500).send("Error when editing a image");
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
        const newImage = {
          name: req.body.name,
        };

        const savedImage = await db.Image.create(newImage);

        reply.code(200).send(savedImage);
        return;
      } catch (e) {
        logger.log("error", "Error while creating a Image :" +e);
        reply.code(500).send("Error when creating a image");
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
        logger.log("error", "Error while deleting image :" +e);
        reply.code(500).send("Error when editing a image");
      }
    }
  );

  done();
};
