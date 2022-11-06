"use strict";
const { Model } = require("sequelize");
const crypto = require("crypto");
const hashingFunctions = require("../services/hashingFunctions");
const { USER_STATUS } = require("../config/consts");

// Specific function definition to handle UTC more easily
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

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
      User.hasMany(models.Answer);
    }

    static async registerFromGoogle(user) {
      let nonce = crypto.randomBytes(16).toString("base64");

      return User.create({
        email: user.email,
        nonce: nonce,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname || "",
        provider: "google",
        googleId: user.googleId,
        googleAccessToken: hashingFunctions.hashPassword(user.accessToken),
        googleRefreshToken: user.refreshToken,
        isLoggedUntil: new Date().addHours(1).toUTCString(),
        avatarUrl: user.avatar,
        rights: "noRights",
        userLocale: user.userLocale,
        lastConnection: new Date().toUTCString(),
      });
    }
    static async updateTokenFromGoogle(userInDB, userFromGoogle) {
      return User.upsert(
        {
          email: userFromGoogle.email,
          nonce: userInDB.nonce,
          nickname: userInDB.nickname,
          firstName: userFromGoogle.firstName,
          lastName: userFromGoogle.lastName,
          rights: "noRights",
          provider: "google",
          googleId: userFromGoogle.googleId,
          googleAccessToken: hashingFunctions.hashPassword(
            userFromGoogle.accessToken
          ),
          googleRefreshToken: userFromGoogle.refreshToken,
          isLoggedUntil: new Date().addHours(1).toUTCString(),
          avatarUrl: userFromGoogle.avatar,
          userLocale: userFromGoogle.userLocale,
          lastConnection: new Date().toUTCString(),
        },
        {
          fields: [
            "googleAccessToken",
            "googleRefreshToken",
            "isLoggedUntil",
            "lastConnection",
          ],
        }
      );
    }
    static async updateExistingProfileWithGoogleAccount(userDB, userGoogle) {
      let nonce = crypto.randomBytes(16).toString("base64");
      userDB.nonce = nonce;
      userDB.firstName = userGoogle.firstName;
      userDB.lastName = userGoogle.lastName;
      userDB.provider = "google";
      userDB.googleId = userGoogle.googleId;
      (userDB.googleAccessToken = hashingFunctions.hashPassword(
        userGoogle.accessToken
      )),
        (userDB.googleRefreshToken = userGoogle.refreshToken);
      userDB.isLoggedUntil = new Date().addHours(1).toUTCString();
      userDB.avatarUrl = userGoogle.avatar;
      userDB.userLocale = userGoogle.userLocale;
      userDB.lastConnection = new Date().toUTCString();

      return userDB.save();
    }

    // We check the token in DB. As they may be several token depending on provider implementation, we ask it as a parameter
    // We check on userID AND the token
    static async isAuthenticated(userID, token, provider = "google") {
      let columnToCheck;
      if (provider === "google") {
        columnToCheck = "googleAccessToken";
      } else {
        console.error("ERROR - provider not recognized. Received :" + provider);
        return false;
      }

      const user = await User.findOne({
        where: {
          [columnToCheck]: token,
          id: userID,
        },
      });

      if (!user) {
        console.warn("No user found.");
        return false;
      }

      // Comparing 2 timestamps
      const isLoggedUntilTimeStamp = new Date(
        user.dataValues.isLoggedUntil
      ).getTime();
      const now = new Date().getTime();

      return isLoggedUntilTimeStamp > now;
    }

    static async isAdmin(userID) {
      const user = await User.findOne({
        where: {
          id: userID,
        },
      });

      if (!user) {
        console.warn("No user found.");
        return false;
      }

      let userStatus = user.dataValues.rights;

      return userStatus === USER_STATUS.ADMIN;
    }

    /**
     * Centralisation des deux fonctions isAuthenticated et isAdmin pour ne faire qu'un appel en DB
     * @param {*} userID
     * @param {*} token
     * @param {*} provider
     * @returns boolean
     */
    static async isAuthenticatedAndAdmin(userID, token, provider = "google") {
      let columnToCheck;
      if (provider === "google") {
        columnToCheck = "googleAccessToken";
      } else {
        console.error("ERROR - provider not recognized. Received :" + provider);
        return false;
      }

      const user = await User.findOne({
        where: {
          [columnToCheck]: token,
          id: userID,
        },
      });

      if (!user) {
        console.warn("No user found.");
        return false;
      }

      // Comparing 2 timestamps
      const isLoggedUntilTimeStamp = new Date(
        user.dataValues.isLoggedUntil
      ).getTime();
      const now = new Date().getTime();

      if (isLoggedUntilTimeStamp > now) {
        let userStatus = user.dataValues.rights;

        return userStatus === USER_STATUS.ADMIN;
      } else {
        console.log("User plus logué.");
        return false;
      }
    }
  }
  User.init(
    {
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      nonce: { type: DataTypes.STRING, allowNull: false },
      nickname: { type: DataTypes.STRING, allowNull: true },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      avatarUrl: DataTypes.STRING,
      provider: { type: DataTypes.STRING },
      googleId: { type: DataTypes.STRING, unique: true },
      googleAccessToken: { type: DataTypes.STRING(300) },
      googleRefreshToken: { type: DataTypes.STRING(500) },
      isLoggedUntil: { type: DataTypes.STRING },
      userLocale: { type: DataTypes.STRING },
      lastConnection: {
        type: DataTypes.STRING,
      },
      rights: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [["admin", "moderator", "noRights"]],
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
