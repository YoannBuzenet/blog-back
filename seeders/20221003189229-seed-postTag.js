"use strict";

const { formatSimple, formatComplex } = require("../services/react-slate");
const { sampleContent, sampleMetaDescription } = require("./dataSample/posts");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "PostTags",
      [
        {
          post_id: 1,
          tag_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 2,
          tag_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 2,
          tag_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 3,
          tag_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 3,
          tag_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 11,
          tag_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 6,
          tag_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 6,
          tag_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 11,
          tag_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 12,
          tag_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          post_id: 12,
          tag_id: 5,
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
