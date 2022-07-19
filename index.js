const path = require("path");
const { logger } = require("./logger");

// https://github.com/pinojs/pino-pretty#integration
// const pino = require("pino");
// const logger = pino({
//   transport: {
//     target: "pino-pretty",
//   },
// });

// { logger: { prettyPrint: true } }
const fastify = require("fastify")();

fastify.register(require("@fastify/cors"), {
  origin: "*",
});

fastify.register(require("@fastify/multipart"));

fastify.register(require("./routes/entities/post"), {
  prefix: "/api/entities/posts",
});
fastify.register(require("./routes/entities/image"), {
  prefix: "/api/entities/images",
});

// Loading debug env variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  const result = require("dotenv").config({
    path: path.resolve(process.cwd(), "./.env.local"),
  });
  if (result.error) {
    throw (
      ".env.local could not be found for non production environment loading. Did you create it ?" +
      result.error
    );
  } else {
    console.log("SUCCESS - .env.local file found.");
  }
}
// Refacto in Development module to load ?
// Loading debug routes
if (process.env.NODE_ENV !== "production") {
  console.log("Loading debug routes into the app");
  // fastify.register(require("./routes/debug_routes/test_DB.js"), {
  //   prefix: "/api/test/DB",
  // });
}

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
