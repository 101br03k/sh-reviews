const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const markdownIt = require("markdown-it");

const db = new sqlite3.Database(
  path.join(__dirname, "..", "db", "database.sqlite"),
);
const md = markdownIt();

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
    // Render markdown for title and review fields
    const reviews = rows.map(r => ({
      ...r,
      title_html: md.renderInline(r.title),
      review_html: md.render(r.review)
    }));
    res.render("index", { reviews, error: null });
  });
});

// GET submission page
router.get("/submit", (req, res) => {
  res.render("submit");
});

// POST a new review with image
router.post("/submit", upload.single("image"), (req, res) => {
  const { title, review, rating } = req.body; // Get rating from body
  const image = req.file ? "/uploads/" + req.file.filename : null;
  if (!title || !review || !rating) return res.redirect("/");

  db.run(
    "INSERT INTO reviews (title, review, image, rating) VALUES (?, ?, ?, ?)",
    [title, review, image, rating],
    function (err) {
      if (err) {
        console.error(err);
        return res.redirect("/");
      }
      res.redirect("/");
    },
  );
});

// GET edit form for a review
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM reviews WHERE id = ?", [id], (err, review) => {
    if (err || !review) {
      return res.redirect("/");
    }
    // Render markdown for title and review fields
    review.title_html = md.renderInline(review.title);
    review.review_html = md.render(review.review);
    res.render("edit", { review });
  });
});

// POST updated review
router.post("/update/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const { title, review, rating } = req.body;

  // Get the old image path first
  db.get("SELECT image FROM reviews WHERE id = ?", [id], (err, row) => {
    if (err || !row) {
      console.error(err);
      return res.redirect("/");
    }

    let imagePath = row.image;
    if (req.file) {
      // Delete old image if it exists
      if (imagePath) {
        const oldImgPath = path.join(__dirname, "..", "public", imagePath);
        fs.unlink(oldImgPath, () => {});
      }
      imagePath = "/uploads/" + req.file.filename;
    }

    db.run(
      "UPDATE reviews SET title = ?, review = ?, image = ?, rating = ? WHERE id = ?",
      [title, review, imagePath, rating, id],
      (err) => {
        if (err) {
          console.error(err);
          return res.redirect("/");
        }
        res.redirect("/");
      }
    );
  });
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
