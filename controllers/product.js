const {connection, queryDatabase} = require('../models/config')
var ip = require('ip');
var {pool} = require("../models/db")


// exports.productId = (req, res)=>{
//     const productId = req.params.id;
//     console.log("productId", productId)

//     const sql = `SELECT * FROM shop where shop_id=?`
//     connection.query(sql, [productId], (error, results) => {
//       if (error) {
//         console.error('Error  product:', error);
//         res.status(500).send('Error fetc product');
//         return;
//       }

//     connection.query('SELECT * FROM shop',(err, itemCart) => {
//       if (err) {
//         console.error('Error  product:', err);
//         res.status(500).send('Error fetc product');
//         return;
//       }

     
//     itemCart.forEach(item => {
//         const shop_id = item.shop_id;
//         const sql = 'SELECT * FROM provar WHERE shop_id = ? LIMIT 1';
//         connection.query(sql, [shop_id], (error, price) => {
//             if (error) {
//                 console.error('Error fetching price:', error);
//                 return;
//             }

//             if (price.length === 0) {
//                 console.log('Price not found for shop_id:', shop_id);
//                 return;
//             }

//             const prices = price;
//             item.price = prices;
//             console.log('Price for shop_id', shop_id, 'is', prices);
//         });
//     });

    
  
//       const sql1 = `SELECT * FROM provar where shop_id=? LIMIT 1`
//       connection.query(sql1, [productId], (error, results1)=>{
//         if(error){
//             console.error('Error  product:', error);
//             res.status(500).send('Error fetc product');
//             return;
//         }

//         const sizeNames = [];
//         const promises = [];
        
//         results1.forEach(row => {
//             const vid = row.vid;
//             const sql3 = `SELECT * FROM variant where id=?`;
        
//             const promise = new Promise((resolve, reject) => {
//                 connection.query(sql3, [vid], (error, variant) => {
//                     if (error) {
//                         console.error('Error fetching size:', error);
//                         reject(error);
//                     } else {
//                         sizeNames.push(variant[0].v_name);
//                         resolve();
//                     }
//                 });
//             });
        
//             promises.push(promise);
//         });
        
//         Promise.all(promises)
//             .then(() => {
//                 var sizeN = sizeNames;
//                 const product = results[0];
//                 console.log("product-cart", results1)
//                 console.log("item-cart", itemCart.price)
//                 res.render('product', {product, results1, sizeN, itemCart})
//             })
//             .catch(error => {
//                 console.error('Error fetching size:', error);
//                 res.status(500).send('Error fetching size');
//             });
//     })
//     });
// })
// }


exports.productId = (req, res)=>{
    const productId = req.params.id;
    console.log("productId", productId)

    const sql = `SELECT * FROM shop where shop_id=?`
    connection.query(sql, [productId], (error, results) => {
      if (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Error fetching product');
        return;
      }

    connection.query('SELECT * FROM shop', (err, itemCart) => {
      if (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products');
        return;
      }

       // Iterate through each item in the shop
    itemCart.forEach(item => {
        const shop_id = item.shop_id;
        // Query to fetch price from provar table based on shop_id
        const sql = 'SELECT * FROM provar WHERE shop_id = ?';
        connection.query(sql, [shop_id], (error, prices) => {
            if (error) {
                console.error('Error fetching prices:', error);
                // Handle the error
                return;
            }

            // Extract the price value from the result
            // const priceValues = prices.map(price => price.price);
            const priceValues = prices;

            // Assign the extracted price value to the item
            item.price = priceValues;
            console.log('Prices for shop_id', shop_id, 'are', priceValues);
        });
    });

    
  
      const sql1 = `SELECT * FROM provar where shop_id=?`
      connection.query(sql1, [productId], (error, results1)=>{
        if(error){
            console.error('Error fetching provar:', error);
            res.status(500).send('Error fetching provar');
            return;
        }

        const sizeNames = [];
        const promises = [];
        
        results1.forEach(row => {
            const vid = row.vid;
            const sql3 = `SELECT * FROM variant where id=?`;
        
            // Create a promise for each query
            const promise = new Promise((resolve, reject) => {
                connection.query(sql3, [vid], (error, variant) => {
                    if (error) {
                        console.error('Error fetching size:', error);
                        reject(error);
                    } else {
                        // console.log("size----", size[0].name);
                        sizeNames.push(variant[0].v_name);
                        resolve();
                    }
                });
            });
        
            promises.push(promise); // Add the promise to the promises array
        });
        
        // Wait for all promises to resolve
        Promise.all(promises)
            .then(() => {
                var sizeN = sizeNames;
                // console.log("new-name", sizeN); 
                const product = results[0];
                console.log("product-cart", results1)
                console.log("item-cart", itemCart)
                res.render('product', {product, results1, sizeN, itemCart})
            })
            .catch(error => {
                console.error('Error fetching size:', error);
                res.status(500).send('Error fetching size');
            });
    })
    });
})
}


exports.getcart = async (req, res)=>{
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
}

exports.postcart = async (req, res)=>{
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
  
            if (existingRows.length > 0) {
                // return res.status(400).send('Product already added to cart.');
               return res.send(`
            <script>
            alert("Information save Successfully we will contact soon");
            window.location.href = "/product/${pid}";
            </script>
          `);
            }
  
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
}

exports.clearcart = (req, res)=>{
    pool.execute("DELETE FROM cart");
    res.redirect("/cart");
}

exports.removecartitem = async (req, res)=>{
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
}