const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/database.sqlite');

const Review = {
    create: (reviewData, callback) => {
        const { title, content, rating, tags } = reviewData;
        const sql = 'INSERT INTO reviews (title, content, rating, tags) VALUES (?, ?, ?, ?)';
        db.run(sql, [title, content, rating, JSON.stringify(tags)], function(err) {
            callback(err, this.lastID);
        });
    },

    getAll: (callback) => {
        const sql = 'SELECT * FROM reviews';
        db.all(sql, [], (err, rows) => {
            if (err) {
                callback(err, null);
                return;
            }
            // Parse tags from JSON string to array
            const reviews = rows.map(row => {
                return {
                    ...row,
                    tags: JSON.parse(row.tags)
                };
            });
            callback(null, reviews);
        });
    }
};

module.exports = Review;