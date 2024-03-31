// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");



const pool = mysql.createPool({
  host: 'braihbrprlonugpl9rgx-mysql.services.clever-cloud.com',
    user: "usfrkrkpbbhvo7eo",
    password: "a5pcKgrf7uJpeUgYY6tF",
    database: "braihbrprlonugpl9rgx",
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