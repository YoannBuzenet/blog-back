"use strict";
const { ENGLISH_LOCALE, FRENCH_LOCALE } = require("../i18n/consts");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Images",
      [
        {
          name: "ohOui.webp",
          path: "public/images/ohOui.webp",
          language: ENGLISH_LOCALE,
          credits: "Test Credits",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Chien allongé",
          path: "https://lemagduchien.ouest-france.fr/images/dossiers/2019-08/chihuahua-095330.jpg",
          language: FRENCH_LOCALE,
          credits: "Test Credits",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Appartement tout neuf",
          path: "https://www.barnes-lyon.com/uploads/life_styles/2/pictures/21833/show_webp.webp?1616012620",
          language: "All",
          credits: "Test Credits",
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
    return queryInterface.bulkDelete("Images", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
