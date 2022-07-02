"use strict";

const { formatSimple, formatComplex } = require("../services/react-slate");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Posts",
      [
        {
          title: formatSimple(
            "Vous pouvez nous contacter chaque jour de la semaine par téléphone et email."
          ),
          shortDescription: formatSimple(
            "Vous pouvez nous contacter chaque jour de la semaine par téléphone et email."
          ),
          content: formatSimple(
            "Vous pouvez nous contacter chaque jour de la semaine par téléphone et email."
          ),
          metaDescription: formatSimple(
            "Vous pouvez nous contacter chaque jour de la semaine par téléphone et email."
          ),
          isScoop: true,
          UserId: 1,
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
    return queryInterface.bulkDelete("Posts", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
