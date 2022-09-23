"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Tags",
      [
        {
          name: "Tag de test",
          language: "FR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sociologie",
          language: "EN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Tech",
          language: "EN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Philosophie",
          language: "FR",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Economie",
          language: "FR",
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
