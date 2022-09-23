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
      Post.belongsToMany(models.Tag, {
        through: models.PostTag,
        foreignKey: "post_id",
      });
      Post.belongsToMany(Post, { as: "Sibling", through: "PostSiblings" });
    }
  }
  Post.init(
    {
      title: {
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
        defaultValue: "EN",
        validate: {
          isIn: {
            args: [["EN", "FR", "SP", "None"]],
            msg: "Value must be EN, or FR, or SP, or 'None'",
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
