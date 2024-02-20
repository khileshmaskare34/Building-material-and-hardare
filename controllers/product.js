const {connection, queryDatabase} = require('../models/config')

exports.productId = (req, res)=>{
    const productId = req.params.id;
    console.log("productId", productId)

    const sql = `SELECT * FROM shop where shop_id=?`
    connection.query(sql, [productId], (error, results) => {
      if (error) {
        console.error('Error  product:', error);
        res.status(500).send('Error fetc product');
        return;
      }

    connection.query('SELECT * FROM shop',(err, itemCart) => {
      if (err) {
        console.error('Error  product:', err);
        res.status(500).send('Error fetc product');
        return;
      }
  
      const sql1 = `SELECT * FROM provar where shop_id=?`
      connection.query(sql1, [productId], (error, results1)=>{
        if(error){
            console.error('Error  product:', error);
            res.status(500).send('Error fetc product');
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
                console.log("new-name", sizeN); 
                const product = results[0];
                console.log("product-cart", product)
                console.log("item-cart", itemCart)
                res.render('product', {product, sizeN, itemCart})
            })
            .catch(error => {
                console.error('Error fetching size:', error);
                res.status(500).send('Error fetching size');
            });
    })
    });
})
}