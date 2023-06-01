const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decodedtoken = jwt.verify(token, "RANDOM_SECRET_KEY")
        const userId = decodedtoken.userId
        req.auth = {
            userId: userId
        }
    }
    catch(error) {
        res.status(401).json({ error })
    }
    next()
}