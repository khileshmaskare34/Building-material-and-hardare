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



// exports.allcat = async (req, res) => {
    
//     const { category, subcategory } = req.query;
//     console.log("Category:", category);
//     console.log("Subcategory:", subcategory);
    
//     let sql = `SELECT DISTINCT shop.* FROM shop`;
    
//     if (category) {
//         sql += ` INNER JOIN category ON shop.category_id = category.category_id WHERE category.category_id IN (${category})`;
//     } else {
//         sql += ` INNER JOIN category ON shop.category_id = category.category_id`;
//     }
    
//     if (subcategory) {
//         if (category) {
//             sql += ` AND`;
//         } else {
//             sql += ` WHERE`;
//         }
//         sql += ` shop.subcategory_id IN (${subcategory})`;
//     }
    
    
    
//     try {
//         const data = await queryDatabase(connection, sql);
//         if (data.length > 0) {
//             res.json({
//                 message: 'Success',
//                 data: data
//             });
//         } else {
//             res.json({
//                 message: 'No data found',
//                 data: []
//             });
//         }
//     } catch (error) {
//         console.error("Error executing SQL query:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }  
    
// };

// exports.allcat = async (req, res) => {
//     const { category, subcategory } = req.query;
//     console.log("Category:", category);
//     console.log("Subcategory:", subcategory);
    
//     let sql = `SELECT DISTINCT shop.* FROM shop`;
    
//     // Join with category table if category filter is provided
//     if (category) {
//         sql += ` INNER JOIN category ON shop.category_id = category.category_id WHERE category.category_id IN (${category})`;
//     } else {
//         sql += ` INNER JOIN category ON shop.category_id = category.category_id`;
//     }
    
//     // Join with subcategory table if subcategory filter is provided
//     if (subcategory) {
//         // If category filter was applied, we use AND instead of WHERE
//         if (category) {
//             sql += ` AND`;
//         } else {
//             sql += ` WHERE`;
//         }
//         sql += ` shop.subcategory_id IN (${subcategory})`;
//     }


//     connection.query('SELECT * FROM provar', (err, provar) => {
//         if (err) {
//           console.error('Error fetching products:', err);
//           res.status(500).send('Error fetching products');
//           return;
//         }
//     })
//     // console.log("Final SQL:", provar);
//     // console.log("SQL:", sql);

    
//     try {
//         const data = await queryDatabase(connection, sql);
//         if (data.length > 0) {
//             res.json({
//                 message: 'Success',
//                 data: data,
//             });
//         } else {
//             res.json({
//                 message: 'No data found',
//                 data: []
//             });
//         }
//     } catch (error) {
//         console.error("Error executing SQL query:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }  
// };

exports.allcat = async (req, res) => {
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

    try {
        // Fetch data from the shop table
        const data = await queryDatabase(connection, sql);
        console.log("data", data)
        // Fetch data from the provar table
        connection.query('SELECT * FROM provar', (err, provar) => {
            if (err) {
                console.error('Error fetching products:', err);
                res.status(500).send('Error fetching products');
                return;
            }

            // Send the data and provar to the frontend
            res.json({
                message: 'Success',
                data: data,
                provar: provar
            });
        });
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
