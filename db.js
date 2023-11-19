const mongoose = require('mongoose');

const db1 = mongoose.createConnection("mongodb://localhost:27017/databaseimage");
const db2 = mongoose.createConnection("mongodb://localhost:27017/databaseuser");

// Other database connections if needed

module.exports = {
    db1,
    db2,
    // Export other databases as needed
};
