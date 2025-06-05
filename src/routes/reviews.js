const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const markdownIt = require("markdown-it");
const md = markdownIt({ breaks: true }); // Enable line breaks on single newline

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
  // Sorting logic
  const sort = req.query.sort || 'date';
  const direction = req.query.direction === 'asc' ? 1 : -1;

  db.all(`SELECT r.*, COUNT(ri.id) as image_count FROM reviews r LEFT JOIN review_images ri ON r.id = ri.review_id GROUP BY r.id`,
    [], (err, rows) => {
      if (err) {
        console.error(err);
        return res.render("index", { reviews: [], error: "Error retrieving reviews", reviewCount: 0 });
      }
      db.all("SELECT * FROM review_images", [], (imgErr, images) => {
        const reviews = rows.map(r => ({
          ...r,
          title_html: md.renderInline(r.title),
          review_html: md.render(r.review),
          images: images.filter(img => img.review_id === r.id)
        }));

        reviews.sort((a, b) => {
          let cmp = 0;
          if (sort === 'date') {
            cmp = new Date(a.created_at) - new Date(b.created_at);
          } else if (sort === 'stars') {
            cmp = a.rating - b.rating;
          } else if (sort === 'images') {
            cmp = (a.image_count || 0) - (b.image_count || 0);
          }
          return cmp * direction;
        });

        res.render("index", { reviews, error: null, reviewCount: reviews.length, req });
      });
    });
});

// GET submission page
router.get("/submit", (req, res) => {
  res.render("submit");
});

// POST a new review with image
router.post("/submit", upload.array("images", 10), (req, res) => {
  const { title, review, rating } = req.body;
  if (!title || !review || !rating) return res.redirect("/");

  db.run(
    "INSERT INTO reviews (title, review, rating) VALUES (?, ?, ?)",
    [title, review, rating],
    function (err) {
      if (err) {
        console.error(err);
        return res.redirect("/");
      }
      const reviewId = this.lastID;
      if (req.files && req.files.length > 0) {
        const stmt = db.prepare("INSERT INTO review_images (review_id, image) VALUES (?, ?)");
        req.files.forEach(file => {
          stmt.run(reviewId, "/uploads/" + file.filename);
        });
        stmt.finalize(() => res.redirect("/"));
      } else {
        res.redirect("/");
      }
    }
  );
});

// GET edit form for a review
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM reviews WHERE id = ?", [id], (err, review) => {
    if (err || !review) return res.redirect("/");
    db.all("SELECT * FROM review_images WHERE review_id = ?", [id], (imgErr, images) => {
      review.images = images || [];
      review.title_html = md.renderInline(review.title);
      review.review_html = md.render(review.review);
      res.render("edit", { review });
    });
  });
});

// POST updated review
router.post("/update/:id", upload.array("images", 10), (req, res) => {
  const id = req.params.id;
  const { title, review, rating, keepImages = [] } = req.body;

  db.run(
    "UPDATE reviews SET title = ?, review = ?, rating = ? WHERE id = ?",
    [title, review, rating, id],
    function (err) {
      if (err) {
        console.error(err);
        return res.redirect("/");
      }
      db.all("SELECT * FROM review_images WHERE review_id = ?", [id], (err, rows) => {
        rows.forEach(img => {
          if (!Array.isArray(keepImages) || !keepImages.includes(img.image)) {
            const imgPath = path.join(__dirname, "..", "public", img.image);
            fs.unlink(imgPath, () => {});
            db.run("DELETE FROM review_images WHERE id = ?", [img.id]);
          }
        });
        if (req.files && req.files.length > 0) {
          const stmt = db.prepare("INSERT INTO review_images (review_id, image) VALUES (?, ?)");
          req.files.forEach(file => {
            stmt.run(id, "/uploads/" + file.filename);
          });
          stmt.finalize(() => res.redirect("/"));
        } else {
          res.redirect("/");
        }
      });
    }
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

// POST /preview - Render a preview of the review
router.post(
  '/preview',
  express.json({ limit: '5mb' }),
  (req, res) => {
    const { title, review, rating, images } = req.body;
    // images: array of base64 strings or URLs
    res.render('partials/review', {
      review: {
        title,
        review,
        rating,
        images: Array.isArray(images) ? images : (images ? [images] : []),
        title_html: md.renderInline(title || ''),
        review_html: md.render(review || '')
      },
      layout: false
    });
  }
);

module.exports = router;
