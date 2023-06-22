const express = require("express")
const app = express()

const mysql = require('mysql')
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "juhosi"
});

// pool.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err);
//       return;
//     }
//     console.log('Connected to MySQL database');
// });

module.exports = pool;
