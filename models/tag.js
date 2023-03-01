"use strict";
const { Model } = require("sequelize");
const { generateRandomHexcode } = require("../services/utils");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsToMany(models.Image, {
        through: models.ImageTag,
        foreignKey: "tag_id",
      });
      Tag.belongsToMany(models.Post, {
        through: models.PostTag,
        foreignKey: "tag_id",
      });
    }
  }
  Tag.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [["en-US", "fr-FR", "sp-SP"]],
            msg: "Value must be en-US, or fr-FR, or sp-SP",
          },
        },
      },
      color_hexcode: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: generateRandomHexcode(),
      },
      usedFor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "image",
        validate: {
          isIn: {
            args: [["image", "post"]],
            msg: "Value must be 'image' or 'post'.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );
  return Tag;
};
