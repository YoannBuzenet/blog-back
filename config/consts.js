const path = require("path");

const MAX_PAGINATION = 50;
const FOLDER_IMAGE = path.join("public", "images");
const DEFAULT_FORMAT_IMAGE = "webp";
const WIDTH_RESIZE_IMAGE = 680;

module.exports = {
  MAX_PAGINATION,
  FOLDER_IMAGE,
  DEFAULT_FORMAT_IMAGE,
  WIDTH_RESIZE_IMAGE,
};
