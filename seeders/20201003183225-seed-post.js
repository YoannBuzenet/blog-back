"use strict";

const { formatSimple, formatComplex } = require("../services/react-slate");
const {
  sampleContent,
  sampleMetaDescription,
  sampleUrl,
} = require("./dataSample/posts");
const { ENGLISH_LOCALE, FRENCH_LOCALE } = require("../i18n/consts");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Posts",
      [
        {
          title: `[{"type":"paragraph","children":[{"text":"Le plus grand ennemi de Tesla"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: ENGLISH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"La nouvelle librairie JS"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: FRENCH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"Lex Friedman reçoit Demis hassabis"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: ENGLISH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"Aux confins de l'univers"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: formatSimple(
            "https://lemagduchien.ouest-france.fr/images/dossiers/2019-08/chihuahua-095330.jpg"
          ),
          isScoop: true,
          language: ENGLISH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"Mes 5 livres préférés"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: ENGLISH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"Sociologie et déterminisme"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: ENGLISH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"Comment penser l'IA ?"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: ENGLISH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"Ce titre a été généré par une IA."}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: ENGLISH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"J'ai installé mon serveur !"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: ENGLISH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"Linux, pour le meilleur et pour le reste"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: ENGLISH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"Fin des travaux"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: FRENCH_LOCALE,
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: `[{"type":"paragraph","children":[{"text":"Emménagement !"}]}]`,
          shortDescription: sampleMetaDescription,
          content: sampleContent,
          metaDescription: sampleMetaDescription,
          mainImageUrl: sampleUrl,
          isScoop: true,
          language: FRENCH_LOCALE,
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
