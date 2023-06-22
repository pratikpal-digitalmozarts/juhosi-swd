const express = require("express")
const app = express()

const mysql = require('mysql')
const pool = mysql.createPool({
    host: "bk2rupwhsg3w9dliuwui-mysql.services.clever-cloud.com",
    user: "umqoirgdui7tsi7v",
    password: "nfr6mAfLt161tgIZZqn0",
    database: "bk2rupwhsg3w9dliuwui"
});

// pool.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err);
//       return;
//     }
//     console.log('Connected to MySQL database');
// });

module.exports = pool;
