const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/database.sqlite');

const Review = {
    create: (reviewData, callback) => {
        const { title, content, rating } = reviewData;
        const sql = 'INSERT INTO reviews (title, content, rating) VALUES (?, ?, ?)';
        db.run(sql, [title, content, rating], function(err) {
            callback(err, this.lastID);
        });
    },

    getAll: (callback) => {
        const sql = 'SELECT * FROM reviews';
        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    }
};

module.exports = Review;