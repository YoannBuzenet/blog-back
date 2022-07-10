"use strict";
const { Model } = require("sequelize");
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
        defaultValue: "EN",
        validate: {
          isIn: {
            args: ["EN", "FR", "SP", "None"],
            msg: "Value must be EN, or FR, or SP, or 'None'",
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
