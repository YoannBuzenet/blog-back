module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PWD_DEV,
    database: process.env.DB_NAME_DEV,
    logging: true,
    host: process.env.DB_HOST_DEV,
    port: 3306,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PWD_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    port: 3306,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PWD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    port: 3306,
    dialect: "mysql",
  },
};
