const {connection, queryDatabase} = require('../models/config')

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
