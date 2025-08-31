const mysql = require("mysql2");
require("dotenv").config(); // load .env variables

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected to FreeSQLDatabase");
});

module.exports = db;
