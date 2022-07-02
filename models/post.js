"use strict";
const { Model } = require("sequelize");
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
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      shortDescription: DataTypes.STRING,
      metaDescription: DataTypes.STRING,
      isScoop: DataTypes.BOOLEAN,
      content: DataTypes.STRING,
      UserId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
