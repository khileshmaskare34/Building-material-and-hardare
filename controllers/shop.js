var {connection, queryDatabase} = require('../models/config')
var {pool} = require('../models/db')

exports.shop1 = (req, res)=>{

    
    
    connection.query('SELECT * FROM shop', (err, shop) => {
        if (err) {
          console.error('Error querying database:', err);
          res.status(500).send('Error querying database');
          return;
        }

        connection.query('SELECT * FROM category', (err2, category)=>{
            if(err2){
                console.error('Error querying database:', err);
                res.status(500).send('Error querying database');
                return;
            }

            connection.query('SELECT * FROM sub_category', (err3, subcategory)=>{
                if(err3){
                    console.error('Error querying database:', err);
                    res.status(500).send('Error querying database');
                    return;
                }

        res.json({shop, category, subcategory});
        // console.log(results);
            })

        })
    
      });
}
exports.shop = (req, res)=>{
     const ide = req.query;
     console.log("print", ide)
    
    
    connection.query('SELECT * FROM shop', (err, shop) => {
        if (err) {
          console.error('Error querying database:', err);
          res.status(500).send('Error querying database');
          return;
        }

        connection.query('SELECT * FROM category', (err2, category)=>{
            if(err2){
                console.error('Error querying database:', err);
                res.status(500).send('Error querying database');
                return;
            }

            connection.query('SELECT * FROM sub_category', (err3, subcategory)=>{
                if(err3){
                    console.error('Error querying database:', err);
                    res.status(500).send('Error querying database');
                    return;
                }
                // console.log("results", category);

        res.render('shop', {shop, category, subcategory, ide});
            })

        })
    
      });
}



exports.filter_by_category = async (req, res)=>{
  
    connection.query(`select * from category`, (err, data)=>{
    if(data.length>0){
        res.json({
            message: 'success',
            data: data
        })
    }else{
        res.json({
            message: 'not get',
            data:[]
        })
    }
})
}


exports.filter_by_subcategory = (req, res)=>{
    connection.query(`select * from sub_category`, (err, data1)=>{
        if(data1.length>0){
            res.json({
                message: 'success',
                data: data1
            })
        }else{
            res.json({
                message: 'not get',
                data:[]
            })
        }
    })
}



exports.allcat = async (req, res) => {
    
        // Fetch cart items for the user's IP address
        const [provarRows, fields] = await pool.execute(
          "SELECT id, shop_id, vid, price, mrp FROM provar"
        );
        // Prepare arrays to store product IDs and variant IDs for fetching product details
        const productIds = [];
        const variantIds = [];
        const quantities = {};
        // Extract product IDs, variant IDs, and quantities from the provarRows
        provarRows.forEach((row) => {
          productIds.push(row.shop_id);
          variantIds.push(row.vid);
          quantities[`${row.shop_id}_${row.vid}`] = row.qty;
        });
        // Generate comma-separated list of product IDs and variant IDs
        const productIdList = productIds.join(",");
        const variantIdList = variantIds.join(",");
        // Fetch product details from product table
        const [productRows] = await pool.execute(
          `SELECT shop_id, name, description, img_1, img_2 FROM shop WHERE shop_id IN (${productIdList})`
        );
        // Fetch individual prices from provar table
        const [priceRows] = await pool.execute(
          `SELECT shop_id, vid, price, mrp FROM provar WHERE shop_id IN (${productIdList}) AND vid IN (${variantIdList})`
        );
        // Construct the response object with product details and individual prices
        const products = productRows.map((product) => {
          const variantId = variantIds[productIds.indexOf(product.id)]; // Get variant ID for the current product
          const quantity = quantities[`${product.id}_${variantId}`] || 0; // Get quantity for the current product variant
          const price =
            priceRows.find(
              (priceRow) =>
                priceRow.shop_id === product.id && priceRow.vid === variantId
            )?.price || 0; // Get individual price for the current product variant
          const mrp =
            priceRows.find(
              (mrpRow) => mrpRow.shop_id === product.id && mrpRow.vid === variantId
            )?.mrp || 0; // Get individual mrp for the current product variant
          return {
            shop_id: product.shop_id,
            vid: variantId,
            name: product.name,
            description: product.description,
            image1: product.image1,
            image2: product.image2,
            quantity: quantity,
            individualPrice: price,
            mrp: mrp,
          };
        });
    const { category, subcategory } = req.query;
    console.log("Category:", category);
    console.log("Subcategory:", subcategory);
    
    let sql = `SELECT DISTINCT shop.* FROM shop`;
    
    // Join with category table if category filter is provided
    if (category) {
        sql += ` INNER JOIN category ON shop.category_id = category.category_id WHERE category.category_id IN (${category})`;
    } else {
        sql += ` INNER JOIN category ON shop.category_id = category.category_id`;
    }
    
    // Join with subcategory table if subcategory filter is provided
    if (subcategory) {
        // If category filter was applied, we use AND instead of WHERE
        if (category) {
            sql += ` AND`;
        } else {
            sql += ` WHERE`;
        }
        sql += ` shop.subcategory_id IN (${subcategory})`;
    }
    
    
    // console.log("Initial SQL:", sql);
    
    try {
        const data = await queryDatabase(connection, sql);
        if (data.length > 0) {


            data.map((item) => {
                // Find the corresponding product in the products array
                const matchingProduct = products.find(
                  (product) => product.shop_id == item.id
                );
      
                // If a matching product is found, update the item with individualPrice and mrp
                if (matchingProduct) {
                  item.individualPrice = matchingProduct.individualPrice;
                  item.mrp = matchingProduct.mrp;
                }
      
                console.log("item =========>", item);
              });




            res.json({
                message: 'Success',
                data: data
            });
        } else {
            res.json({
                message: 'No data found',
                data: []
            });
        }
    } catch (error) {
        console.error("Error executing SQL query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }  
    
};


exports.shop_filter_by_category = async (req, res) => {
    const category_id = req.params.categoryId;
    // console.log("Category ID", category_id);

    if (category_id) {
        const sql = 'SELECT * FROM shop WHERE category_id = ?';
        // console.log("SQL Query", sql);
        
        try {
            const data = await queryDatabase(connection, sql, [category_id]);
            // console.log("Query Result:", data);
            
            if (data.length > 0) {
                res.json({
                    message: 'Data retrieved successfully',
                    data: data
                });
            } else {
                res.json({
                    message: 'No data found for the given category ID',
                    data: []
                });
            }
        } catch (error) {
            // console.error("Error executing SQL query:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        console.log("Category ID is missing");
        res.status(400).json({ error: "Category ID is missing" });
    }
};
