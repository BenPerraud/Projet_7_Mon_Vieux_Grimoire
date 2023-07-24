const sharp = require("sharp")
const fs = require("fs")

module.exports = async (req, res, next) => {
    const folderName = "processed_images"

    try {
        if(!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName)
        } 
    } catch (error) {
        console.log(error)
    }
    

    if (req.file) {
        const { originalname, filename, path } = req.file 
        const filenameWithoutExtension = originalname.split(".")[0]
        const uniquePrefix = Date.now()
        const newFilename = `${filenameWithoutExtension}_${uniquePrefix}.webp`
        const resizedImagePath = `${folderName}/${newFilename}`
        
        try {
            await sharp(path)
                .resize(320, 240)
                .toFormat("webp")
                .webp({ quality: 80 })
                .toFile(resizedImagePath)

            req.sharp = {
                imageUrl: `${req.protocol}://${req.get("host")}/processed_images/${newFilename}`
            }

            fs.unlink(path, (err) => {
                if (err) throw err
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    next()
}

