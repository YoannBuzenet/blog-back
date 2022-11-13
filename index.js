const path = require("path");
const { logger } = require("./logger");

const fastify = require("fastify")({
  logger: {
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  },
});

//TODO cacher ça dans un autre fichier
fastify.register(require("@fastify/cors"), {
  origin: "*",
});

fastify.register(require("@fastify/multipart"));

fastify.register(require("./routes/entities/post/post"), {
  prefix: "/api/entities/posts",
});
fastify.register(require("./routes/entities/image"), {
  prefix: "/api/entities/images",
});
fastify.register(require("./routes/user/user"), {
  prefix: "/api/entities/users",
});
fastify.register(require("./routes/entities/tag/tag"), {
  prefix: "/api/entities/tags",
});
fastify.register(require("./routes/entities/answer/auth"), {
  prefix: "/api/entities/answers",
});
fastify.register(require("./routes/entities/answer/private"), {
  prefix: "/api/entities/answers",
});
fastify.register(require("./routes/entities/answer/public"), {
  prefix: "/api/entities/answers",
});

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/", // optional: default '/'
});

if (process.env.NODE_ENV !== "production") {
  // Loading debug env variables
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

  // Loading test routes
  console.log("Loading test routes...");
  fastify.register(require("./routes/test/answer"), {
    prefix: "/api/test/entities/answers",
  });
  fastify.register(require("./routes/test/user"), {
    prefix: "/api/test/entities/user",
  });
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
