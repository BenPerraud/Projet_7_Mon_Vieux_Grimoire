const Book = require("../models/Book")
const fs = require("fs")


exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book)
    const book = new Book ({
        userId: req.auth.userId,
        title: bookObject.title,
        author: bookObject.author,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        year: bookObject.year,
        genre: bookObject.genre,
        ratings: {
            userId: req.auth.userId,
            grade: bookObject.ratings[0].grade
        },
        averageRating: 0
    })
    book.save()
        .then(() => res.status(201).json({ message: "Livre ajouté"}))
        .catch(error => res.status(400).json({ error }))
}


exports.rateBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            const ratingsNbre = book.ratings.length
            let sum = 0
            for (let i=0; i < book.ratings.length; i++) {
                sum += book.ratings[i].grade
            }
            const newAverageRating = ((sum + req.body.rating) / (ratingsNbre+1)).toFixed(2)
            Book.findOneAndUpdate(
                { _id: req.params.id }, 
                { $push: {ratings: {
                    userId: req.auth.userId,
                    grade: req.body.rating
                }},
                averageRating: newAverageRating},
                {returnDocument:"after"}
            )
                .then((book) => res.status(200).json(book))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(400).json({ error }))
}

exports.findAllBook = (req, res) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))
}

exports.findOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(201).json(book))
        .catch(error => res.status(400).json({ error }))
}

exports.findBestBook = (req, res) => {
    function threeBestBooks (x) {
        x.sort((a, b) => b.averageRating - a.averageRating)
        const result = [x[0], x[1], x[2]]
        return result
    }

    Book.find()
        .then(books => res.status(200).json(threeBestBooks(books)))
        .catch(error => res.status(400).json({ error }))    
}

exports.modifyBook = (req, res) => {   
    if (req.file === undefined) {
        Book.updateOne({ _id: req.params.id }, {
            userId: req.auth.userId,
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
            genre: req.body.genre,
            _id: req.params.id })
            .then(() => res.status(200).json({ message: "Livre modifié sans modification de l'image" }))
            .catch(error => res.status(400).json({ error }))
    } else {
        Book.updateOne({ _id: req.params.id }, {
            userId: req.auth.userId,
            title: req.body.title,
            author: req.body.author,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            year: req.body.year,
            genre: req.body.genre,
            _id: req.params.id })
            .then(() => res.status(200).json({ message: "Livre modifié avec image modifiée" }))
            .catch(error => res.status(400).json({ error }))
    }    
}

exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized"})
            } else {
                const filename = book.imageUrl.split("/images/")[1]
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Livre supprimé"}))
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch( error => res.status(500).json({ error }))
}



