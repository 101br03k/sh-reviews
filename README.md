# SH Reviews Website

A simple and elegant web application that allows users to submit and view reviews with ratings and image uploads. Built with Node.js, Express, and SQLite.

## Features

- Submit reviews with username, text content, and star ratings (1-5 stars)
- Upload images with reviews
- View all reviews in chronological order (newest first)
- Edit existing reviews
- Delete reviews (with automatic image cleanup)
- Responsive design with clean UI
- SQLite database for data persistence

## Project Structure

```
review-website/
├── src/
│   ├── app.js                    # Main application entry point
│   ├── db/
│   │   ├── database.sqlite       # SQLite database file (auto-generated)
│   │   └── placeholder.md        # Ensures db directory exists
│   ├── models/
│   │   └── review.js            # Review model for database operations
│   ├── routes/
│   │   └── reviews.js           # API routes for review CRUD operations
│   ├── views/
│   │   ├── index.ejs            # Main page displaying all reviews
│   │   ├── submit.ejs           # Review submission form
│   │   └── edit.ejs             # Review editing form
│   └── public/
│       ├── style.css            # Application styles
│       ├── uploads/             # Directory for uploaded images
│       └── SH-Reviews-logo/     # Logo assets
├── package.json                 # Dependencies and scripts
├── .replit                      # Replit configuration
└── README.md                    # This file
```

## Installation

1. Fork or clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. The SQLite database will be created automatically when you first run the app

## Usage

1. Start the application:
   ```bash
   npm start
   ```
2. Open your browser and navigate to the application URL
3. Click "Submit a Review" to add a new review
4. Use the edit/delete buttons on existing reviews to modify them

## Database Schema

The application uses SQLite with the following table structure:

```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  review TEXT NOT NULL,
  image TEXT,
  rating INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Dependencies

- **Express**: Web framework for Node.js
- **EJS**: Templating engine for dynamic HTML
- **SQLite3**: Database engine
- **Multer**: Middleware for handling file uploads
- **Body-parser**: Middleware for parsing form data

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

GPL-3.0 license, which can be found in full detail in the LICENCE file. 