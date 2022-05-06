"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post);
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      nickname: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      avatarUrl: DataTypes.STRING,
      rights: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: ["admin", "moderator", "noRights"],
            msg: "Value must be admin, or moderator, or noRights",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
