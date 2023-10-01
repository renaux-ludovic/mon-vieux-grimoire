const multer = require("multer");

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
});

module.exports = multer({ storage: storage }).single("image");