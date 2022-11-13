const path = require("path");
const { logger } = require("./logger");

const { fastify } = require("./fastify");

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3001, "0.0.0.0");
  } catch (err) {
    console.log("err", err);
    logger.log("error", `FASTIFY ERROR - ${err}"`);

    process.exit(1);
  }
};

start();
