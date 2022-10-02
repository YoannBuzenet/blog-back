"use strict";

const { formatSimple, formatComplex } = require("../services/react-slate");
const { sampleContent, sampleMetaDescription } = require("./dataSample/posts");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "ImageTags",
      [
        {
          image_id: 1,
          tag_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image_id: 2,
          tag_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image_id: 2,
          tag_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image_id: 3,
          tag_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image_id: 3,
          tag_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          image_id: 2,
          tag_id: 6,
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
    return queryInterface.bulkDelete("ImageTags", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
