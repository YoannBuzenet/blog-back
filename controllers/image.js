const sharp = require("sharp");
const { FOLDER_IMAGE } = require("../config/consts");

const cropImage = async (image, x, y, width, height) => {
  sharp(image)
    .extract({ left: x, top: y, width: width, height: height })
    .toFile(FOLDER_IMAGE, function (err) {
      // Extract a region of the input image, saving in the same format.
      if (err) {
        console.log("error while registering image", err);
      } else {
        console.log("maybe it worked");
      }
    });
  return true;
};

module.exports = {
  cropImage,
};
