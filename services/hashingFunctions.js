const crypto = require("crypto");

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("base64");
};

module.exports = { hashPassword };
