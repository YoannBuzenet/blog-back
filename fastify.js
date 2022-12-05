const path = require("path");

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

fastify.register(require("@fastify/cors"), {
  origin: "*",
});

fastify.register(require("@fastify/multipart"), { attachFieldsToBody: true });

fastify.register(require("./routes/entities/answer/private"), {
  prefix: "/api/entities/answers",
});
fastify.register(require("./routes/entities/answer/public"), {
  prefix: "/api/entities/answers",
});
fastify.register(require("./routes/entities/answer/auth"), {
  prefix: "/api/entities/answers",
});
fastify.register(require("./routes/entities/image/auth"), {
  prefix: "/api/entities/images",
});
fastify.register(require("./routes/entities/image/private"), {
  prefix: "/api/entities/images",
});
fastify.register(require("./routes/entities/image/public"), {
  prefix: "/api/entities/images",
});
fastify.register(require("./routes/entities/image/authMultiPart"), {
  prefix: "/api/entities/images",
});
fastify.register(require("./routes/entities/post/public"), {
  prefix: "/api/entities/posts",
});
fastify.register(require("./routes/entities/post/private"), {
  prefix: "/api/entities/posts",
});
fastify.register(require("./routes/entities/post/auth"), {
  prefix: "/api/entities/posts",
});
fastify.register(require("./routes/entities/tag/auth"), {
  prefix: "/api/entities/tags",
});
fastify.register(require("./routes/entities/tag/private"), {
  prefix: "/api/entities/tags",
});
fastify.register(require("./routes/entities/tag/public"), {
  prefix: "/api/entities/tags",
});
fastify.register(require("./routes/entities/user/auth"), {
  prefix: "/api/entities/users",
});
fastify.register(require("./routes/entities/user/private"), {
  prefix: "/api/entities/users",
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

module.exports = { fastify };
