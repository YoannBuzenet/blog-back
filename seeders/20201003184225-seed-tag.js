"use strict";

const { FRENCH_LOCALE, ENGLISH_LOCALE } = require("../i18n/consts");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Tags",
      [
        {
          name: "Tag de test",
          language: FRENCH_LOCALE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sociologie",
          language: ENGLISH_LOCALE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Tech",
          language: ENGLISH_LOCALE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Philosophie",
          language: FRENCH_LOCALE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Economie",
          language: FRENCH_LOCALE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tags", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
