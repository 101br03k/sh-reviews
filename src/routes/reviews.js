const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const db = new sqlite3.Database(
  path.join(__dirname, "..", "db", "database.sqlite"),
);

// Set up multer for image uploads
const uploadDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET all reviews
router.get("/", (req, res) => {
  db.all("SELECT * FROM reviews ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.render("index", {
        reviews: [],
        error: "Error retrieving reviews",
      });
    }
    res.render("index", { reviews: rows, error: null });
  });
});

// POST a new review with image
router.post("/submit", upload.single("image"), (req, res) => {
  const { username, review, rating } = req.body; // Get rating from body
  const image = req.file ? "/uploads/" + req.file.filename : null;
  if (!username || !review || !rating) return res.redirect("/");

  db.run(
    "INSERT INTO reviews (username, review, image, rating) VALUES (?, ?, ?, ?)",
    [username, review, image, rating],
    function (err) {
      if (err) {
        console.error(err);
        return res.redirect("/");
      }
      res.redirect("/");
    },
  );
});

// DELETE a review
router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  // First, get the image path to delete the file
  db.get("SELECT image FROM reviews WHERE id = ?", [id], (err, row) => {
    if (row && row.image) {
      const imgPath = path.join(__dirname, "..", "public", row.image);
      fs.unlink(imgPath, () => {
        // Ignore errors if file doesn't exist
      });
    }
    db.run("DELETE FROM reviews WHERE id = ?", [id], (err) => {
      res.redirect("/");
    });
  });
});

module.exports = router;
