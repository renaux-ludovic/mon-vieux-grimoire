const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

mongoose
  .connect(process.env.CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());
app.use("/images", express.static("images"));

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
