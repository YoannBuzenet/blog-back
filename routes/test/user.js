const path = require("path");
const { logger } = require("../../logger");
const db = require("../../models/index");
const { isComingFromBlog } = require("../../services/authControl");

module.exports = function (fastify, opts, done) {
  fastify.get(
    "/",
    {
      schema: {},
    },
    async (req, reply) => {
      try {
        const user = await db.User.findOne({
          where: {
            id: 1,
          },
        });

        const isLoggedUntil = user.dataValues.isLoggedUntil;
        const test = new Date(isLoggedUntil);

        reply.code(200).send(test.getTime());
      } catch (error) {
        logger.log(
          "error",
          "TEST ENDPOINT - Error while searching for user :" + error
        );
        reply.code(500).send(error);
      }

      return;
    }
  );

  fastify.get(
    "/authEndpointPassPhrase",
    {
      schema: {},
    },
    async (req, reply) => {
      const isRequestAuthorized = isComingFromBlog(req.headers);

      if (!isRequestAuthorized) {
        return reply.code(401).send("Unauthorized");
      } else {
        return reply.code(200).send("Ok Bro");
      }
    }
  );
  done();
};
