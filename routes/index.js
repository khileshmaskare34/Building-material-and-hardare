var express = require('express');
var router = express.Router();

var {pool} = require("../models/db")
var {connection, queryDatabase} = require("../models/config");


const { shop,
       allcat, 
       filter_by_category, 
       filter_by_subcategory } = require('../controllers/shop');

const { productId,
       getcart, 
       postcart, 
       clearcart,
       removecartitem} = require('../controllers/product');

const { sendmail } = require('../nodemailer');
const { sendmail2 } = require('../nodemailer2');

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM category', (err, category)=>{
    if(err){
      console.erroe("Error", err);
      res.status(500).send('Error')
    }
    // console.log("new", category)
    res.render('index', {category});
  })
});


router.get('/shop',  shop);

router.get('/category', filter_by_category)

router.get('/subcategory', filter_by_subcategory)

router.get('/allcat', allcat)

router.get('/product/:id', productId);




router.get("/cart", getcart);

router.post('/addCart', postcart);

router.get("/clearCart", clearcart);

router.get("/removeCartItem/:pidVid", removecartitem);

router.post("/updateQty", async (req, res) => {
  const updatedQuantities = req.body;

  // Using Object.keys()
  const keys = Object.keys(updatedQuantities);
  keys.forEach((key) => {
    const productId = key.split("[")[1].split("-")[0]; // Extract productId from the key
    const variationId = key.split("-")[1].split("]")[0]; // Extract variationId from the key
    const quantity = updatedQuantities[key];

    const updateQuery = "UPDATE cart SET qty = ? WHERE pid = ? AND vid = ?";
    pool.execute(updateQuery, [quantity, productId, variationId]);
  });

  res.redirect("/cart"); // Redirect back to the cart page
});




router.get('/Enquiry', (req, res)=>{
  res.render('enquiry');
})
router.post('/Enquiry', (req, res)=>{
  
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
})


router.get('/get-started', (req, res)=>{
  res.render('get_started', {success: ""})
})

// router.post('/get-started', (req, res)=>{
//   const { name, email, phone, product, message } = req.body;
//   console.log("name", name, email, phone, product, message);

//   // Insert the form data into the database
//   pool.query('INSERT INTO getstarted (name, email, phone, product, message) VALUES (?, ?, ?, ?, ?)', 
//     [name, email, phone, product, message], 
//     (error, results, fields) => {
//       if (error) {
//         console.error('Error inserting data into database:', error);
//         // Handle the error appropriately, e.g., send an error response
//         return res.status(500).send('Error inserting data into database');
//       }
      
     
//   });
//    // Data inserted successfully
//    var success = "Thank you for submitting the details. Back to the HomePage";
//    res.render('get_started', { success });

//     // Redirect to the homepage after 3 seconds
//     setTimeout(() => {
//       res.redirect('/'); // Adjust the URL if your homepage has a different route
//     }, 3000);
//   //  res.send("hiii")
// })

router.post('/get-started', (req, res) => {
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

});


// Route to handle search query
router.get("/search/:q", async (req, res) => {
  const searchTerm = req.params.q; // Get search term from query parameter
  const Query = `SELECT * FROM shop WHERE name LIKE '%${searchTerm}%' `;
  //
  const [results] = await pool.query(Query);
  console.log("====================>", results);
  res.json(results); // Send JSON response with search results
});

module.exports = router;
 