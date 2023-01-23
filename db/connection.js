// import and require mysql2
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = db;