const dotenv = require("dotenv")

dotenv.config()
const URL = process.env.MONGO_URL
console.log(URL)

module.exports = URL