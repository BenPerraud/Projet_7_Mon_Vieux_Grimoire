const sharp = require("sharp")

module.exports = (req, res, next) => {
    const newPath = "processed_images\\"+req.file.filename
    sharp(req.file.path)
        .resize(320, 240)
        .toFile(newPath)
    next()
}