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
      Answer.belongsTo(Answer, { foreignKey: "ParentAnswerId" });
    }

    static async isSamePost(parentAnswerId, newAnswerPostId) {
      const answer = await Answer.findOne({
        where: {
          id: parentAnswerId,
        },
      });

      const idPostParentAnswer = answer?.dataValues?.PostId;
      const idPostParentAnswerInt = parseInt(idPostParentAnswer, 10);

      const newAnswerPostIdInt = parseInt(newAnswerPostId, 10);

      return idPostParentAnswerInt === newAnswerPostIdInt;
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
      ParentAnswerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Answer",
    }
  );
  return Answer;
};
