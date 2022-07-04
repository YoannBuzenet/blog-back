"use strict";

const { formatSimple, formatComplex } = require("../services/react-slate");
const { sampleContent, sampleMetaDescription } = require("./dataSample/posts");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "PostTags",
      [
        {
          postid: 1,
          tag_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postid: 2,
          tag_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postid: 2,
          tag_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postid: 3,
          tag_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postid: 3,
          tag_id: 1,
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
    return queryInterface.bulkDelete("PostTags", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
