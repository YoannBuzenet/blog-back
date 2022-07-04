const path = require("path");
const { capitalizeFirstLetter } = require("../utils");
const fs = require("fs").promises;

// TODO -> ajouter la pagination aux endpoints all (overridable)

const endpointCreator = (entity) => {
  const capitalizedEntity = capitalizeFirstLetter(entity);

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
        const { sort, limit } = req.query;

        // On récupère toutes les propriétés du modèle pour filtrer les éventuels filtres reçus en query param
        const allPropertiesFrom${capitalizedEntity} = Object.keys(db.${capitalizedEntity}.rawAttributes);

        // Préparer la requete
        let filters = {};

        if (allPropertiesFrom${capitalizedEntity}.includes(sort)) {
          filters.order = [[sort, "DESC"]];
        }
        if (limit && +limit < MAX_PAGINATION) {
          filters.limit = +limit;
        } else {
          filters.limit = MAX_PAGINATION;
        }

        const ${entity} = await db.${capitalizedEntity}.findAll(filters);

        reply.code(200).send(${entity});

      } catch (error) {
        logger.log("error", "Error while searching for all ${capitalizedEntity}s :" + error);
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
        const ${entity} = await db.${capitalizedEntity}.findOne({
          where: {
            id: req.params.id,
          },
        });
        if (${entity}) {
          reply.code(200).send(${entity});
        } else {
          reply.code(404).send("${entity} non trouvé.");
        }
      } catch (error) {
        logger.log("error", "Error while searching for all ${capitalizedEntity}s :" +error);
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
      const ${entity} = await db.${capitalizedEntity}.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        // change object, save it
        for (const prop in req.body) {
          ${entity}[prop] = req.body[prop];
        }

        const saved${capitalizedEntity} = await ${entity}.save();

        reply.code(200).send(saved${capitalizedEntity});
        return;
      } catch (e) {
        logger.log("error", "Error while searching for${capitalizedEntity} : "+e);
        reply.code(500).send("Error when editing a ${entity}");
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
        const new${capitalizedEntity} = {
          name: req.body.name,
        };

        const saved${capitalizedEntity} = await db.${capitalizedEntity}.create(new${capitalizedEntity});

        reply.code(200).send(saved${capitalizedEntity});
        return;
      } catch (e) {
        logger.log("error", "Error while creating a ${capitalizedEntity} :" +e);
        reply.code(500).send("Error when creating a ${entity}");
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
      const ${entity} = await db.${capitalizedEntity}.findOne({
        where: {
          id: req.params.id,
        },
      });

      try {
        //Delete
        const deleted${capitalizedEntity} = await ${entity}.destroy();
        reply.code(200).send(deleted${capitalizedEntity}.dataValues);

        return;
      } catch (e) {
        logger.log("error", "Error while deleting ${entity} :" +e);
        reply.code(500).send("Error when editing a ${entity}");
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
    console.log("Endpoint crée à la racine!");
  } catch (e) {
    console.log("Erreur lors de la création du fichier", e);
  }
};

const myArgs = process.argv.slice(2);
if (myArgs.length === 0) {
  console.log("Vous avez oublié le nom de l'entité.");
} else {
  createFile(myArgs[0]);
}

module.exports = {
  createFile,
};
