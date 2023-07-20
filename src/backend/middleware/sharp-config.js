const sharp = require("sharp")
const fs = require("fs")

module.exports = (req, res, next) => {
    const newPath = "processed_images\\"+req.file.filename
    console.log(req.file)
    const {path, filename} = req.file

    sharp(req.file.path)
        .resize(320, 240)
        .toFile(newPath)
    
    console.log(12)
    fs.unlink(path, (err => {
        if (err) console.log(err)})
    )
    
    next()
}

