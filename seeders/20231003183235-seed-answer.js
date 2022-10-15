"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Answers",
      [
        {
          content: `[{"type":"paragraph","children":[{"text":"Tesla's biggest threat is not external - it is from trying to do too many things."}]}]`,
          UserId: 1,
          PostId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: `[{"type":"paragraph","children":[{"text":"I totally agree with your statement."}]}]`,
          UserId: 1,
          PostId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: `[{"type":"paragraph","children":[{"text":"J'ai toujours pensé que les magniolias étaient plus sympas."}]}]`,
          UserId: 1,
          PostId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // This one is an answer to answer 3
        {
          content: `[{"type":"paragraph","children":[{"text":"Je préfère les marguerites."}]}]`,
          UserId: 1,
          PostId: 2,
          ParentAnswerId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // This one is an answer to answer 4
        {
          content: `[{"type":"paragraph","children":[{"text":"Tout à fait Bobby."}]}]`,
          UserId: 1,
          PostId: 2,
          ParentAnswerId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // This one is ANOTHER answer to answer 3
        {
          content: `[{"type":"paragraph","children":[{"text":"Et que penser de la chance dûe au fait de naitre au bon endroit ? Je veux dire, même oprhelin, il est né dans la Silicon Valley chez un ingénieur !"}]}]`,
          UserId: 1,
          PostId: 2,
          ParentAnswerId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // This one is ANOTHER answer to answer 4
        {
          content: `[{"type":"paragraph","children":[{"text":"Arrêtez votre spam !"}]}]`,
          UserId: 1,
          PostId: 2,
          ParentAnswerId: 4,
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
    return queryInterface.bulkDelete("Answers", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
