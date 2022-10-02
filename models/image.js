"use strict";
const { Model } = require("sequelize");
const { ENGLISH_LOCALE, FRENCH_LOCALE } = require("../i18n/consts");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsToMany(models.Tag, {
        through: models.ImageTag,
        foreignKey: "image_id",
      });
    }
  }
  Image.init(
    {
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ENGLISH_LOCALE,
        validate: {
          isIn: {
            args: [[ENGLISH_LOCALE, FRENCH_LOCALE, "SP", "All"]],
            msg: `Value must be ${ENGLISH_LOCALE}, or ${FRENCH_LOCALE}, or SP, or 'All'`,
          },
        },
      },
      credits: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};
