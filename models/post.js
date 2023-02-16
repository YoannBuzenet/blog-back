"use strict";
const { Model } = require("sequelize");
const { ENGLISH_LOCALE, FRENCH_LOCALE } = require("../i18n/consts");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User);
      Post.belongsToMany(models.Tag, {
        through: models.PostTag,
        foreignKey: "post_id",
      });
      Post.belongsToMany(Post, { as: "Sibling", through: "PostSiblings" });
      Post.hasMany(models.Answer);
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      url : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      shortDescription: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mainImageUrl: {
        type: DataTypes.STRING,
      },
      metaDescription: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isScoop: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Certains posts ne doivent pas remonter (car ils servent de content page ailleurs par exemple)
      isOutOfPostFeed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ENGLISH_LOCALE,
        validate: {
          isIn: {
            args: [[ENGLISH_LOCALE, FRENCH_LOCALE, "SP", "None"]],
            msg: `Value must be ${ENGLISH_LOCALE}, or ${FRENCH_LOCALE}, or SP, or 'None'`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
