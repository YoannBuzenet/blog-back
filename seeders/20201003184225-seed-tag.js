"use strict";

const { FRENCH_LOCALE, ENGLISH_LOCALE } = require("../i18n/consts");
const { generateRandomHexcode } = require("../services/utils");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Tags",
      [
        {
          name: "Tag de test",
          language: FRENCH_LOCALE,
          usedFor: "image",
          color_hexcode: generateRandomHexcode(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sociologie",
          language: FRENCH_LOCALE,
          usedFor: "post",
          color_hexcode: generateRandomHexcode(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Philosophy",
          language: ENGLISH_LOCALE,
          usedFor: "post",
          color_hexcode: generateRandomHexcode(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Tech",
          language: ENGLISH_LOCALE,
          usedFor: "post",
          color_hexcode: generateRandomHexcode(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Philosophie",
          language: FRENCH_LOCALE,
          usedFor: "image",
          color_hexcode: generateRandomHexcode(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Economie",
          language: FRENCH_LOCALE,
          usedFor: "image",
          color_hexcode: generateRandomHexcode(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Banniere",
          color_hexcode: generateRandomHexcode(),
          language: FRENCH_LOCALE,
          usedFor: "post",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Steve",
          color_hexcode: generateRandomHexcode(),
          language: FRENCH_LOCALE,
          usedFor: "post",
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
