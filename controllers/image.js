const sharp = require("sharp");
const { FOLDER_IMAGE } = require("../config/consts");

const cropImage = async (image, x, y, width, height, imageName) => {
  // console.log("C4EST OK", image);
  // console.log("C4EST OK", x);
  // console.log("C4EST OK", y);
  // console.log("C4EST OK", width);
  // console.log("C4EST OK", height);
  const xNumber = parseInt(x, 10);
  const yNumber = parseInt(y, 10);
  const widthNumber = parseInt(width, 10);
  const heightNumber = parseInt(height, 10);

  sharp(image)
    .extract({
      left: xNumber,
      top: yNumber,
      width: widthNumber,
      height: heightNumber,
    })
    .toFile(`${FOLDER_IMAGE}/${imageName}`, function (err) {
      // Extract a region of the input image, saving in the same format.
      if (err) {
        console.log("--- error while registering image", err);
      } else {
        console.log(" +++ maybe it worked");
      }
    });
  return true;
};

module.exports = {
  cropImage,
};
