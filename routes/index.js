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
       removecartitem,
       updateQty} = require('../controllers/product');

const { sendmail } = require('../nodemailer');
const { sendmail2 } = require('../nodemailer2');
const { sendmail_cont } = require('../nodemailer_contact');
const { getStarted, contact, searchbar, enquiry } = require('../controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM shop', (err, shopitem)=>{
    if(err){
      console.error("Error", err);
      res.status(500).send('Error')
    }
    console.log("new", shopitem)
    res.render('index', {shopitem});
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

router.post("/updateQty", updateQty);



// enquery page get and post route -----------
router.get('/Enquiry', (req, res)=>{
  res.render('enquiry');
})
router.post('/Enquiry', enquiry)

// get started page get and post route--------------
router.get('/get-started', (req, res)=>{
  res.render('get_started', {success: ""})
})
router.post('/get-started', getStarted);

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



// search bar get route-----------
router.get("/search/:q", searchbar);

// contact page  get and post route-------------
router.get("/contact", (req, res)=>{
  res.render('contact');
})
router.post("/contact", contact)

// about page get route--------------------------
router.get("/about", (req, res)=>{
  res.render('about');
})

// terms and condition page get route---------------
router.get("/terms-candition", (req, res)=>{
  res.render('terms_candition');
})


module.exports = router;
 