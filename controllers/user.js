const {connection, queryDatabase} = require('../models/config')
var ip = require('ip');
var {pool} = require("../models/db")



exports.getStarted = async (req, res)=>{
    var name = req.body.name;
    var email = req.body.email;
    // var name = req.body.name;
    // var name = req.body.name;
    const {phone, product, message } = req.body;
    console.log("name", name, email, phone, product, message);
  
  
    // Insert the form data into the database
    pool.query('INSERT INTO getstarted (name, email, phone, product, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, product, message],
      (error, results, fields) => {
        if (error) {
          console.error('Error inserting data into database:', error);
          // Handle the error appropriately, e.g., send an error response
          return res.status(500).send('Error inserting data into database');
        }
        
        
              // Data inserted successfully
            });
            sendmail2(req, res, email)
           
            res.send(`
            <script>
              alert("Information save Successfully we will contact soon");
              window.location.href = "/";
            </script>
          `);
  
}

exports.contact = async (req, res)=>{
    const email = req.body.email;
    sendmail_cont(req, res, email)
           
            res.send(`
            <script>
              alert("Information save Successfully we will contact soon");
              window.location.href = "/";
            </script>
          `);
    console.log("email", email);
  
}

exports.searchbar = async (req, res)=>{
    const searchTerm = req.params.q; // Get search term from query parameter
    const Query = `SELECT * FROM shop WHERE name LIKE '%${searchTerm}%' `;
    //
    const [results] = await pool.query(Query);
    console.log("====================>", results);
    res.json(results); // Send JSON response with search results
}

exports.enquiry = async (req, res)=>{
      // const email = "chakravartiashish2406@gmail.com";
  const email = req.body.email;
  const phone = req.body.phone;
  const product = req.body.product;
  const address = req.body.address;
  console.log("email is ", email, phone, address, product)
  sendmail(req, res, email, phone, product, address);
  res.send(`
  <script>
    alert("Information save Successfully we will contact soon");
    window.location.href = "/cart";
  </script>
`);
}