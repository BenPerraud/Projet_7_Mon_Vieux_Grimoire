const express = require("express")
const bookCtrl = require("../controllers/book")
const sharp = require("../middleware/sharp-config")
const multer = require("../middleware/multer-config")
const auth = require("../middleware/auth")
const router = express.Router()

router.post(`/`, auth, multer, sharp, bookCtrl.createBook)
router.post(`/:id/rating`, auth, bookCtrl.rateBook)
router.get(`/`, bookCtrl.findAllBook)
router.get(`/bestrating`, bookCtrl.findBestBook)
router.get(`/:id`, bookCtrl.findOneBook)
router.put(`/:id`, auth, multer, sharp, bookCtrl.modifyBook)
router.delete(`/:id`, auth, bookCtrl.deleteBook)

module.exports = router