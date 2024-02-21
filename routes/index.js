var express = require('express');
var router = express.Router();
var ip = require('ip');

var {pool} = require("../models/db")
var {connection, queryDatabase} = require("../models/config");


const { shop, allcat, filter_by_category, filter_by_subcategory } = require('../controllers/shop');
const { productId } = require('../controllers/product');
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




router.get("/cart", async function (req, res, next) {
  const userIp = ip.address(); // Retrieve user's IP address from request object

  try {
    // Fetch cart items for the user's IP address
    const [cartRows] = await pool.execute(
      "SELECT pid, vid, qty FROM cart WHERE ipadd = ?",
      [userIp]
    );

    if (cartRows.length === 0) {
      return res.render("cart", {
        title: "myCart",
        user: "",
        products: [],
      });
    }

    // Prepare arrays to store product IDs, variant IDs, and quantities
    const productIds = [];
    const variantIds = [];
    const quantities = {};

    // Extract product IDs, variant IDs, and quantities from cartRows
    cartRows.forEach((row) => {
      productIds.push(row.pid);
      variantIds.push(row.vid);
      quantities[`${row.pid}_${row.vid}`] = row.qty;
    });

    // Generate comma-separated lists of product IDs and variant IDs
    const productIdList = productIds.join(",");
    const variantIdList = variantIds.join(",");

    // Fetch product details from shop table
    const [productRows] = await pool.execute(
      `SELECT shop_id AS pid, name, description, img_1, img_2 FROM shop WHERE shop_id IN (${productIdList})`
    );

    // Fetch individual prices from provar table
    const [priceRows] = await pool.execute(
      `SELECT shop_id AS pid, vid, price FROM provar WHERE shop_id IN (${productIdList}) AND vid IN (${variantIdList})`
    );

    // Construct the response object with product details and individual prices
    const products = productRows.map((product) => {
      const variantId = variantIds[productIds.indexOf(product.pid)]; // Get variant ID for the current product
      const quantity = quantities[`${product.pid}_${variantId}`] || 0; // Get quantity for the current product variant
      const priceRow = priceRows.find((priceRow) =>
        priceRow.pid === product.pid && priceRow.vid === variantId
      );
      const individualPrice = priceRow ? priceRow.price : 0; // Get individual price for the current product variant
      console.log("oo",individualPrice)
      return {
        pid: product.pid,
        vid: variantId,
        name: product.name,
        description: product.description,
        image1: product.img_1,
        image2: product.img_2,
        quantity: quantity,
        individualPrice: individualPrice,
      };
    });

    console.log("product", products)
    // Render the cart page with product details
    res.render("cart", {
      title: "myCart",
      user: "",
      products: products,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});




router.get("/clearCart", (req, res, next) => {
  pool.execute("DELETE FROM cart");
  res.redirect("/cart");
});



router.post('/addCart', async (req, res) => {
  const { shop_id, size, quantity } = req.body;
  const pid = shop_id;
  let vid = size;
  const qty = quantity;
  const ipAdd = ip.address();
  console.log("lll", pid, vid, qty, ipAdd)

  const [vidRow] = await pool.execute(
    'SELECT id FROM variant where v_name = ? ',
    [vid]
  )
  vid = vidRow[0].id;

  if (!pid || !vid || !ipAdd) {
      return res.status(400).send('Product ID, variant ID, and IP address are required.');
  }

  try {
      const sql1 = `SELECT * FROM provar WHERE shop_id = ? LIMIT 1`;
      connection.query(sql1, [pid], async (error, results) => {
          if (error) {
              console.error('Error fetching price:', error);
              return res.status(500).send('Error fetching price');
          }

          // if (results.length === 0) {
          //     return res.status(404).send('Product not found.');
          // }

          const price = results[0].price;
          console.log("price", price)

          // Check if the combination of product_id and variant_id already exists in the cart
          const [existingRows] = await pool.execute(
              'SELECT * FROM cart WHERE pid = ? AND vid = ? AND ipadd = ?',
              [pid, vid, ipAdd]
          );

          // if (existingRows.length > 0) {
          //     return res.status(400).send('Product already added to cart.');
          // }

          // Insert product into cart table
          await pool.execute(
              'INSERT INTO cart (pid, vid, ipadd, qty, price) VALUES (?, ?, ?, ?, ?)',
              [pid, vid, ipAdd, qty, price]
          );

          // Redirect to cart page after adding the product to cart
          res.redirect('/cart');
      });
  } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).send('Internal server error.');
  }
});


router.get("/removeCartItem/:pidVid", async (req, res, next) => {
  try {
    let pidVid = req.params.pidVid;
    console.log(pidVid);

    // Find the index of the "," sign
    let separatorIndex = pidVid.indexOf(",");

    if (separatorIndex !== -1) {
      // Check if the "," sign is found
      // Split the string into two parts based on the "," sign
      let pid = pidVid.substring(0, separatorIndex);
      let vid = pidVid.substring(separatorIndex + 1);

      const deleteQuery = `DELETE FROM cart WHERE pid = ? AND vid = ?`;
      await pool.execute(deleteQuery, [pid, vid]);

      res.redirect("/cart");
    }
  } catch (error) {
    return res.send(
      "<script>alert(`Error deleting product, please try again.`)</script>"
    );
  }
});

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
 