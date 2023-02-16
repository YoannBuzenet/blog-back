"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Posts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      shortDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mainImageUrl: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      metaDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isScoop: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isOutOfPostFeed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Posts");
  },
};
