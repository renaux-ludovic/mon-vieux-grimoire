const sharp = require("sharp");

module.exports = async function process(req, res, next) {
  if (req.file) {
    const nameWithoutSpaces = req.file.originalname
      .split(" ")
      .join("_")
      .toString()
      .split(".");

    const nameWithoutExtension = nameWithoutSpaces[0];
    const timestamp = Date.now();
    filename = `${nameWithoutExtension}_${timestamp}.webp`;

    const imgPath = `../backend/images/${filename}`;

    await sharp(req.file.buffer)
      .resize({
        width: 400,
        fit: sharp.fit.contain,
      })
      .toFormat("webp")
      .toFile(imgPath);
    res.locals.filename = filename;
    next();
  } else {
    next();
  }
};
