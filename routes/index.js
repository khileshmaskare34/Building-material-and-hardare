var express = require('express');
var router = express.Router();

var ip = require('ip');

var {pool} = require("../models/db")
var {connection, queryDatabase} = require("../models/config");


const { shop, allcat, filter_by_category, filter_by_subcategory } = require('../controllers/shop');
const { productId } = require('../controllers/product');

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

router.get('/get-started', (req, res)=>{
  res.render('get_started')
})


router.get("/cart", async function (req, res, next) {
  const userIp = ip.address();

  try {
    // Fetch cart items for the user's IP address
    const [cartRows, fields] = await pool.execute(
      "SELECT id, pid, vid, qty FROM cart WHERE ipadd = ?",
      [userIp]
    );

   

    if (cartRows.length === 0) {
      return res.render("cart", {
        title: "myCart",
        user: "",
        products: [],
      });
    }

    // Prepare arrays to store product IDs and variant IDs for fetching product details
    const productIds = [];
    const variantIds = [];
    const quantities = {};

    // Extract product IDs, variant IDs, and quantities from the cartRows
    cartRows.forEach((row) => {
      productIds.push(row.pid);
      variantIds.push(row.vid);
      quantities[`${row.pid}_${row.vid}`] = row.qty;
    });

    // Generate comma-separated list of product IDs and variant IDs
    const productIdList = productIds.join(",");
    const variantIdList = variantIds.join(",");

    // console.log("======================>", productIdList);
    // Fetch product details from product table
    const [productRows] = await pool.execute(
      `SELECT id, name, description, image1, image2 FROM product WHERE id IN (${productIdList})`
    );

    // Fetch individual prices from provar table
    const [priceRows] = await pool.execute(
      `SELECT pid, vid, price FROM provar WHERE pid IN (${productIdList}) AND vid IN (${variantIdList})`
    );

    // Construct the response object with product details and individual prices
    const products = productRows.map((product) => {
      const variantId = variantIds[productIds.indexOf(product.id)]; // Get variant ID for the current product
      const quantity = quantities[`${product.id}_${variantId}`] || 0; // Get quantity for the current product variant
      const price =
        priceRows.find(
          (priceRow) =>
            priceRow.pid === product.id && priceRow.vid === variantId
        )?.price || 0; // Get individual price for the current product variant
      return {
        pid: product.id,
        vid: variantId,
        name: product.name,
        description: product.description,
        image1: product.image1,
        image2: product.image2,
        quantity: quantity,
        individualPrice: price,
      };
    });


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

router.post("/addCart", async (req, res) => {
  const { shop_id, size, quantity } = req.body;
  const pid = shop_id;
  const vid = size;
  const qty = quantity;
  console.log("its",pid, vid, qty)

  const ipAdd = ip.address();

  try {
    // Check if the combination of pid and vid already exists in the cart
    const [existingRows] = await pool.execute(
      "SELECT * FROM cart WHERE ipadd = ? AND pid = ? AND vid = ?",
      [ipAdd, pid, vid]
    );

    if (existingRows.length > 0) {
      // If the combination of pid and vid already exists, return a message
      return res.send(
        "<script> alert('Item already exists in the cart') </script>"
      );
    }

    // Fetch price from provar table based on pid and vid
    const [rows, fields] = await pool.execute(
      "SELECT price FROM provar WHERE shop_id = ? AND vid = ?",
      [pid, vid]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product variant not found." });
    }

    const price = rows[0].price * qty;

    // Insert into cart table
    await pool.query(
      "INSERT INTO cart (ipadd, pid, vid, qty, price) VALUES (?, ?, ?, ?, ?)",
      [ipAdd, pid, vid, qty, price]
    );

    res.redirect("/cart");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;



module.exports = router;
 