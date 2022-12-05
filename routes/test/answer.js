const path = require("path");
const { logger } = require("../../logger");
const db = require("../../models/index");

module.exports = function (fastify, opts, done) {

  fastify.addHook("preHandler", (request, reply, done) => {
    console.log("TEST req reçue", request);
    console.log("TEST req.body", request.body);

    
    done();
  });


  fastify.get(
    "/:idParentAnswer/:idPostChild",
    {
      schema: {},
    },
    async (req, reply) => {
      const { idParentAnswer, idPostChild } = req.params;

      try {
        const isSamePostId = await db.Answer.isSamePost(
          idParentAnswer,
          idPostChild
        );

        reply.code(200).send(isSamePostId);
      } catch (error) {
        logger.log("error", "Error while searching for all Answers :" + error);
        reply.code(500).send(error);
      }

      return;
    }
  );
  done();
};
