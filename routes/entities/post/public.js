const { logger } = require("../../../logger");
const db = require("../../../models/index");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = function (fastify, opts, done) {
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
          include: {
            model: db.Post,
            as: "Sibling",
          },
        });
        if (post) {
          reply.code(200).send(post);
        } else {
          reply.code(404).send("Post non trouvé.");
        }
      } catch (error) {
        logger.log("error", "Error while searching for one Post :" + error);
        reply.code(500).send(error);
      }

      return;
    }
  );

 
  fastify.get(
    "/title/:title",
    {
      schema: {},
    },
    async (req, reply) => {

      const { like, language } = req.query;

      let post;
      let filters = {}

      if(language){
        filters.language = language;
      }

      try {
        if(like){
          filters.title = {[Op.like]: `%${req.params.title}%`};

          post = await db.Post.findAll({
            where: {
              ...filters
            },
            // include: {
            //   model: db.Post,
            //   as: "Sibling",
            // },
          });
        }
        else{
          filters.title = req.params.title;

          await db.Post.findOne({
            where: {
              ...filters
            },
            include: {
              model: db.Post,
              as: "Sibling",
            },
          });
        }

        if (post) {
          reply.code(200).send(post);
        } else {
          reply.code(404).send("Post par titre non trouvé.");
        }

      } catch (error) {
        logger.log(
          "error",
          "Error while searching for one Post by title :" + error
        );
        reply.code(500).send(error);
      }

      return;
    }
  );

  done();
};
