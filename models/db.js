// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");



const pool = mysql.createPool({
  host: "localhost",
    user: "root",
    password: "",
    database: "alnakiya_db",
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database successfully!");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Error connecting to MySQL database:", error);
  }
})();

// ----------------------------




module.exports = {pool};