const mysql = require('mysql2');

let db_credentials = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
}

var conn = mysql.createPool(db_credentials);

module.exports = conn;