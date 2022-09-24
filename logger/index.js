const { createLogger, format, transports } = require("winston");
const { timestamp, combine, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), myFormat),
  defaultMeta: { service: "user-service" },
  transports: [
    //TODO : check si on peut écrire un simple console.log
    // tag NODE_ENV=development dispo avec npm run start:dev
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxSize: 10000000,
      maxFiles: 1,
    }),
    new transports.File({
      filename: "logs/combined.log",
      maxSize: 10000000,
      maxFiles: 1,
    }),
  ],
  exitOnError: false,
});

module.exports = {
  logger,
};
