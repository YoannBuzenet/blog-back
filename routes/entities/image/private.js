const path = require("path");
const { logger } = require("../../../logger");
const db = require("../../../models/index");
const consumers = require("node:stream/consumers");
const {
  MAX_PAGINATION,
  FOLDER_IMAGE,
  DEFAULT_FORMAT_IMAGE,
} = require("../../../config/consts");
const { FRENCH_LOCALE } = require("../../../i18n/consts");
const fs = require("fs");
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



  done();
};
