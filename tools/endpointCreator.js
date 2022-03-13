const path = require("path");
const fs = require("fs").promises;

const endpointCreator = (entity) => {
  return `const path = require("path");
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
        const themes = await db.Theme.findAll();

        reply.code(200).send(themes);
      } catch (error) {
        logger.log("error", "Error while searching for all Themes :" + error);
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
        const theme = await db.Theme.findOne({
          where: {
            id: req.params.id,
          },
        });
        reply.code(200).send(theme);
      } catch (error) {
        logger.log("error", \`Error while searching for all Themes :" +error);
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
      const theme = await db.Theme.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        // change object, save it
        for (const prop in req.body) {
          theme[prop] = req.body[prop];
        }

        const savedTheme = await theme.save();

        reply.code(200).send(savedTheme);
        return;
      } catch (e) {
        logger.log("error", \`Error while searching for  Theme : "+e);
        reply.code(500).send("Error when editing a theme");
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
        const newTheme = {
          name: req.body.name,
        };

        const savedTheme = await db.Theme.create(newTheme);

        reply.code(200).send(savedTheme);
        return;
      } catch (e) {
        logger.log("error", "Error while creating a Theme :" +e);
        reply.code(500).send("Error when creating a theme");
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
      const theme = await db.Theme.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        //Delete
        const deletedTheme = await theme.destroy();
        reply.code(200).send(deletedTheme.dataValues);

        return;
      } catch (e) {
        logger.log("error", "Error while deleting theme :" +e);
        reply.code(500).send("Error when editing a theme");
      }
    }
  );

  done();
};

`;
};

const createFile = async (entity) => {
  //Juste créer le ficher avec node, checker qu'il y a pas d'erreurs
  try {
    const data = endpointCreator(entity);
    const file = await fs.writeFile(`${entity}.js`, data, "utf8");
  } catch (e) {
    console.log("Erreur lors de la création du fichier", e);
  }
};

module.exports = {
  createFile,
};
