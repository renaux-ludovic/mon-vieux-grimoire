const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/bookCtrl");
const multer = require("../middleware//multer-config");
const auth = require("../middleware/auth");
const sharp = require("../middleware/sharp-config");

router.post("/", auth, multer, sharp, bookCtrl.createOneBook);
router.post("/:id/rating", auth, bookCtrl.handleRating);

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);
router.get("/:id", bookCtrl.getOneBook);

router.put("/:id", auth, multer, sharp, bookCtrl.updateOneBook);

router.delete("/:id", auth, bookCtrl.deleteOneBook);

module.exports = router;
