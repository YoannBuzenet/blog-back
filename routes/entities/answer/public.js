const { logger } = require("../../../logger");
const db = require("../../../models/index");

module.exports = function (fastify, opts, done) {
  // All answers for one post
  fastify.get(
    "/posts/:id",
    {
      schema: {},
    },
    async (req, reply) => {
      try {
        const answer = await db.Answer.findAll({
          where: {
            PostId: req.params.id,
          },
          include: {
            model: db.User,
            attributes: ["id", "nickname"],
          },
        });

        // Removing all props but the one we want from user objects

        if (answer) {
          reply.code(200).send(answer);
        } else {
          reply.code(404).send("answers non trouvées.");
        }
      } catch (error) {
        logger.log(
          "error",
          "Error while searching for all Answers for one post:" + error
        );
        reply.code(500).send(error);
      }

      return;
    }
  );

  done();
};
