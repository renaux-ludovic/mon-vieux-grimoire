const Book = require("../models/bookModel");
const fs = require("fs"); // Module File system pour gérer les fichiers
// const sharpConfig = require("../middleware/sharp-config"); // Configuration Sharp pour la manipulation d'images

exports.createOneBook = async (req, res, next) => {
  try {
    const bookData = JSON.parse(req.body.book);

    if (!req.file) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      res.locals.filename
    }`;

    const newBook = new Book({
      ...bookData,
      userId: req.auth.userId,
      imageUrl,
    });

    await newBook.save();

    res.status(201).json({ message: "Nouveau livre créé avec succès" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getOneBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: "Livre introuvable" });
  }
};

exports.getBestRating = async (req, res, next) => {
  try {
    const bestRating = await Book.find().sort({ averageRating: -1 }).limit(3);

    res.status(200).json(bestRating);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateOneBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const existingBook = await Book.findById(bookId);

    // Suppression de l'ancienne image si une nouvelle image est téléchargée
    if (req.file && existingBook.imageUrl) {
      const imagePath = existingBook.imageUrl.replace(
        `${req.protocol}://${req.get("host")}/`,
        ""
      );
      fs.unlinkSync(imagePath);
    }

    const updatedData = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            res.locals.filename
          }`,
        }
      : { ...req.body };

    await Book.updateOne({ _id: bookId }, updatedData);
    res.status(200).json({ message: "Livre modifié !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.deleteOneBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    // Récupération du nom de l'image à partir de l'URL
    const imageFilename = book.imageUrl.split("/").pop();

    await Book.deleteOne({ _id: req.params.id });

    // Suppression l'image dans le dossier "images"
    const imagePath = `../backend/images/${imageFilename}`;
    fs.unlinkSync(imagePath);

    res.status(200).json({ message: "Livre supprimé !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.handleRating = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const rating = req.body.rating;

    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return res
        .status(404)
        .json({ message: "Le livre ne figure pas dans la liste." });
    }

    if (!(rating >= 0 && rating <= 5)) {
      return res
        .status(400)
        .json({ message: "La note doit être comprise entre 0 et 5." });
    }

    if (book.userId === req.body.userId) {
      return res.status(400).json({
        message: "L'utilisateur a déjà noté ce livre",
      });
    }

    const newRating = {
      userId: req.body.userId,
      grade: rating,
    };

    book.ratings.push(newRating);
    book.averageRating = updatedAverageRating(book, rating);

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function updatedAverageRating(book, newRating) {
  const totalRatings = book.ratings.length + 1;
  const newTotalRating = book.averageRating * book.ratings.length + newRating;
  return Math.round((newTotalRating / totalRatings) * 10) / 10;
}
