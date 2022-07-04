"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Images",
      [
        {
          name: "La belle image",
          path: "https://www.google.fr",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Chien allongé",
          path: "https://www.google.fr/le-petit-chien",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Appartement tout neuf",
          path: "https://unappart.fr",
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
