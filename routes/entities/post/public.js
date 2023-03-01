const { logger } = require("../../../logger");
const db = require("../../../models/index");
const Sequelize = require('sequelize');
const { formatSimple } = require("../../../services/react-slate");
const { buildFilterFromPossibleArrayQueryParam } = require("../../../services/parsing");
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
            // On omet les posts ispublished : false
            isPublished: true
          },
          include: [{
            model: db.Post,
            as: "Sibling",
          }, {
            model: db.Tag,
          }],
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

      const { title } = req.params
      const decodedTitle = decodeURI(title)

      let post;
      let filters = {}

      if (language) {
        filters.language = language;
      }

      // On omet les posts ispublished : false
      filters.isPublished = true;


      try {
        if (like === "true") {
          filters.title = { [Op.like]: `%${decodedTitle}%` };

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
        else {
          filters.title = { [Op.like]: `%${decodedTitle}%` };

          // Obligé de rechercher avec "like" sinon, vu que sequelize escape chaque quote du string du titre au format react-slate, il n'arrive plus à faire matcher
          // Car en base, ce n'est pas échappé

          post = await db.Post.findOne({
            where: {
              ...filters
            },
            include: [{
              model: db.Post,
              as: "Sibling",
            }, {
              model: db.Tag,
            }],
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

  fastify.get(
    "/url/:url",
    {
      schema: {},
    },
    async (req, reply) => {

      const { url } = req.params

      let post;
      let filters = {}

      // On omet les posts ispublished : false
      filters.isPublished = true;


      try {

        filters.url = url;

        post = await db.Post.findOne({
          where: {
            ...filters
          },
          include: [{
            model: db.Post,
            as: "Sibling",
          }, {
            model: db.Tag,
          }],
        });


        if (post) {
          reply.code(200).send(post);
        } else {
          reply.code(404).send("Post par url non trouvé.");
        }

      } catch (error) {
        logger.log(
          "error",
          "Error while searching for one Post by url :" + error
        );
        reply.code(500).send(error);
      }

      return;
    }
  );

  fastify.get(
    "/tags",
    {
      schema: {},
    },
    async (req, reply) => {

      const { tags } = req.query;


      let post;
      let filters = {}

      // On omet les posts ispublished : false
      filters.isPublished = true;

      const tagFilter = buildFilterFromPossibleArrayQueryParam(tags, 'name', Op)


      try {

        post = await db.Post.findAll({
          where: {
            ...filters
          },
          include: [{
            model: db.Tag,
            where: tagFilter
          }],
        });


        if (post) {
          reply.code(200).send(post);
        } else {
          reply.code(404).send("Post par Tag non trouvé.");
        }

      } catch (error) {
        logger.log(
          "error",
          "Error while searching for one Post by url :" + error
        );
        reply.code(500).send(error);
      }

      return;
    }
  );

  done();
};
