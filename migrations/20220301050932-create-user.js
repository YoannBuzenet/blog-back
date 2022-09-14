"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("Users", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        email: {
          type: Sequelize.STRING,
        },
        firstName: {
          type: Sequelize.STRING,
        },
        lastName: {
          type: Sequelize.STRING,
        },
        provider: {
          type: Sequelize.STRING,
        },
        googleId: {
          type: Sequelize.STRING,
        },
        googleAccessToken: {
          type: Sequelize.STRING,
        },
        googleRefreshToken: {
          type: Sequelize.STRING,
        },
        isLoggedUntil: {
          type: Sequelize.STRING,
        },
        nickname: {
          type: Sequelize.STRING,
        },
        firstName: {
          type: Sequelize.STRING,
        },
        lastName: {
          type: Sequelize.STRING,
        },
        avatarUrl: {
          type: Sequelize.STRING,
        },
        userLocale: {
          type: Sequelize.STRING,
        },
        lastConnection: {
          type: Sequelize.STRING,
        },
        nonce: {
          type: Sequelize.STRING,
        },
        rights: {
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(function () {
        queryInterface.bulkInsert("Users", [
          {
            email: "ybuzenet@gmail.com",
            nickname: "Yoann",
            firstName: "Yoann",
            lastName: "Buzenet",
            avatarUrl: "url",
            rights: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
