"use strict";
const { Model } = require("sequelize");
const { ENGLISH_LOCALE, FRENCH_LOCALE } = require("../i18n/consts");
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Answer.belongsTo(models.User);
      Answer.belongsTo(models.Post);
    }
  }
  Answer.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Answer",
    }
  );
  return Answer;
};
