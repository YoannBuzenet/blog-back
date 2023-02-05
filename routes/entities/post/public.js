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

      const { like } = req.query;

      let post;
      try {
        if(like){

          post = await db.Post.findAll({
            where: {
              title: {[Op.like]: `%${req.params.title}%`,
            }},
            // include: {
            //   model: db.Post,
            //   as: "Sibling",
            // },
          });
        }
        else{
          await db.Post.findOne({
            where: {
              title: req.params.title,
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
