# SH Reviews Website

A simple and elegant web application that allows users to submit, view, edit, and delete reviews with ratings and image uploads. Built with Node.js, Express, EJS, and SQLite.

---

## Features

- **Submit reviews** with title, Markdown-formatted content, star rating (1-5), and optional image upload.
- **Live Markdown preview** while editing or submitting a review, using the same layout as the main page.
- **Edit existing reviews** with instant image preview and Markdown support.
- **Delete reviews** (with automatic image cleanup).
- **View all reviews** in reverse chronological order (newest first).
- **Responsive design** with a clean UI.
- **Review counter**: See the total number of reviews at the top of the main page.
- **Image popup**: Click on a review image to view it larger in an overlay.
- **SQLite database** for data persistence.
- **Automatic database and upload folder creation** on first run.

---

## Project Structure

```
review-website/
├── src/
│   ├── app.js                    # Main application entry point
│   ├── db/
│   │   ├── database.sqlite       # SQLite database file (auto-generated)
│   │   └── placeholder.md        # Ensures db directory exists
│   ├── models/
│   │   └── review.js             # Review model for database operations
│   ├── routes/
│   │   └── reviews.js            # API routes for review CRUD operations
│   ├── views/
│   │   ├── index.ejs             # Main page displaying all reviews
│   │   ├── submit.ejs            # Review submission form (with preview)
│   │   ├── edit.ejs              # Review editing form (with preview)
│   │   └── partials/
│   │       └── review.ejs        # Partial for rendering a single review (used in preview)
│   └── public/
│       ├── style.css             # Application styles
│       ├── review-image-adjust.js# Script for image sizing and popup
│       ├── uploads/              # Directory for uploaded images
│       └── SH-Reviews-logo/      # Logo assets
├── package.json                  # Dependencies and scripts
├── Dockerfile                    # Docker support
├── docker-compose.yml            # Docker Compose support
└── README.md                     # This file
```

---

## Installation

1. **Clone this repository:**
   ```bash
   git clone https://github.com/101br03k/sh-reviews
   cd sh-reviews
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **The SQLite database and upload folders will be created automatically on first run.**

---

## Usage

1. **Start the application:**
   ```bash
   npm start
   ```
   Or with Docker:
   ```bash
   docker compose up
   ```
2. **Open your browser and navigate to:**  
   [http://localhost:3000](http://localhost:3000)
3. **Main actions:**
   - Click **"Add New Review"** to submit a new review.
   - Use the **Edit** button to modify a review (with live Markdown and image preview).
   - Use the **Delete** button (on the edit page) to remove a review.
   - See the **total number of reviews** at the top of the main page.

---

## Markdown Support

- **Both the review title and review text fields support Markdown formatting.**
- Markdown is rendered on the main page, in the edit view (with live preview), and for all reviews.
- Example formatting:
  - `**bold**`, `*italic*`, `# Heading`, `- lists`, `[link](https://example.com)`, etc.
- **Line breaks**: Single newlines in the review text are rendered as `<br>`.

---

## Image Upload & Preview

- You can upload an image with your review.
- When editing, selecting a new image instantly updates the preview.
- Clicking on a review image opens a larger popup view.

---

## Database Schema

The application uses SQLite with the following table structure:

```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  review TEXT NOT NULL,
  image TEXT,
  rating INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Dependencies

- **Express**: Web framework for Node.js
- **EJS**: Templating engine for dynamic HTML
- **SQLite3**: Database engine
- **Multer**: Middleware for handling file uploads
- **Body-parser**: Middleware for parsing form data
- **markdown-it**: Markdown parser and renderer for Node.js

---

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

---

## License

GPL-3.0 license, which can be found in full detail in the LICENSE file.