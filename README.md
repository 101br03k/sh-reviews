# Review Website

This project is a simple web application that allows users to submit and view reviews. It uses SQLite as the database to store the reviews.

## Project Structure

```
review-website
├── src
│   ├── app.js               # Entry point of the application
│   ├── db
│   │   └── database.sqlite   # SQLite database file for storing reviews
│   ├── models
│   │   └── review.js        # Review model for interacting with the database
│   ├── routes
│   │   └── reviews.js       # Routes for handling review submissions and fetching reviews
│   ├── views
│   │   ├── index.ejs        # Main view template displaying reviews and submission form
│   │   └── submit.ejs       # View template for submitting a new review
├── package.json              # npm configuration file
└── README.md                 # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/101br03k/sh-reviews
   ```
2. Navigate to the project directory:
   ```
   cd review-website
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```
2. Open your web browser and go to `http://localhost:3000` to view the application.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.