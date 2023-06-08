const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.createUser = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
            email: req.body.email,
            password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: "Inscription validée"}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))    
}

exports.connectUser = (req, res) => {
    User.findOne ({email: req.body.email})
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: "Couple identifiants/mot de passe incorrect"})
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: "Couple identifiants/mot de passe incorrect" })
                        } else {
                            res.status(201).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    "RANDOM_SECRET_KEY",
                                    {expiresIn: "24h"}
                                )
                            })
                        }
                    })
                    .catch(error => res.status(500).json({ error }))
            }})       
        .catch(error => res.status(500).json({ error}))
        
}

