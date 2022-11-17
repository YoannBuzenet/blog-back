const path = require("path");
const { MAX_PAGINATION } = require("../../../config/consts");
const { ENGLISH_LOCALE } = require("../../../i18n/consts");
const { logger } = require("../../../logger");
const db = require("../../../models/index");
const { isComingFromBlog } = require("../../../services/authControl");

module.exports = function (fastify, opts, done) {
  fastify.addHook("preHandler", (request, reply, done) => {
    const isRequestAuthorized = isComingFromBlog(request.headers);

    if (!isRequestAuthorized) {
      reply.code(401).send("Unauthorized");
      return;
    }
    done();
  });

  fastify.get(
    "/:id",
    {
      schema: {},
    },
    async (req, reply) => {
      try {
        const tag = await db.Tag.findOne({
          where: {
            id: req.params.id,
          },
        });
        if (tag) {
          reply.code(200).send(tag);
        } else {
          reply.code(404).send("tag non trouvé.");
        }
      } catch (error) {
        logger.log("error", "Error while searching for all Tags :" + error);
        reply.code(500).send(error);
      }

      return;
    }
  );

  done();
};
