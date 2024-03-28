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
    try {
     const ide = req.query;
    //  console.log("print", ide)
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
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.filter_by_category = async (req, res)=>{
  try {
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
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}


exports.filter_by_subcategory = (req, res)=>{
  try {
    console.log("catid", req.body);

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
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
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

// exports.allcat = async (req, res) => {
//     const { category, subcategory } = req.query;
//     console.log("Category:", category);
//     console.log("Subcategory:", subcategory);


//     if (category && Array.isArray(category) && category.length > 0) {
//         const categoryIds = category.join(',');
//         console.log("new",categoryIds);

//         const cat_sql =`SELECT * FROM cat_subcat  WHERE category_id IN (${categoryIds})`;
//         connection.query(cat_sql, (err, subcatData)=>{
//             if(err){
//                 console.log(err);
//             }
//             // console.log("subcat:",subcatData)
//             subcatData.forEach(e=>{

//                 const subcatid = e.subcategory_id;
//                 // console.log("subcatid:",subcatid)

//                 const subcat_sql = `SELECT * FROM sub_category where subcategory_id= ${subcatid}`;
//                 connection.query(subcat_sql, (err, subData)=>{
//                     if(err){
//                         console.log(err);
//                     }
//                     console.log("subData", subData);
//                 })
//             })

//         })
//     }


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

//     try {
//         // Fetch data from the shop table
//         const data = await queryDatabase(connection, sql);
//         // console.log("data", data)
//         // Fetch data from the provar table
//         connection.query('SELECT * FROM provar', (err, provar) => {
//             if (err) {
//                 console.error('Error fetching products:', err);
//                 res.status(500).send('Error fetching products');
//                 return;
//             }

//             connection.query('SELECT * FROM variant', (err, variant) => {
//                 if (err) {
//                     console.error('Error fetching products:', err);
//                     res.status(500).send('Error fetching products');
//                     return;
//                 }

                


//             // Send the data and provar to the frontend
//             res.json({
//                 message: 'Success',
//                 data: data,
//                 provar: provar,
//                 variant: variant,
//             });
//         });
//     })
//     } catch (error) {
//         console.error("Error executing SQL query:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }  
// };







exports.allcat = async (req, res) => {
    const { category, subcategory } = req.query;
    console.log("Category:", category);
    console.log("Subcategory:", subcategory);

    let subData = []; // Initialize subData array

    if (category && Array.isArray(category) && category.length > 0) {
        const categoryIds = category.join(',');
        console.log("new", categoryIds);

        const cat_sql = `SELECT * FROM cat_subcat  WHERE category_id IN (${categoryIds})`;
        connection.query(cat_sql, (err, subcatData) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
            }

            // Fetch subData for each subcategory
            const subcategoryIds = subcatData.map(e => e.subcategory_id).join(',');
            const subcat_sql = `SELECT * FROM sub_category WHERE subcategory_id IN (${subcategoryIds})`;
            connection.query(subcat_sql, (err, subDataResult) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: "Internal Server Error" });
                    return;
                }

                subData = subDataResult; // Assign subData

                // Proceed to fetch main data
                fetchMainData();
            });
        });
    } else {
        // If no category provided or it's not an array or empty, proceed directly to fetching main data
        fetchMainData();
    }

   async function fetchMainData() {
        let sql = `SELECT DISTINCT shop.* FROM shop`;

        // Join with category table if category filter is provided
        if (category) {
            sql += ` INNER JOIN category ON shop.category_id = category.category_id WHERE category.category_id IN (${category})`;
        } else {
            sql += ` INNER JOIN category ON shop.category_id = category.category_id`;
        }

        // Join with subcategory table if subcategory filter is provided
        if (subcategory) {
            // If category filter was applied, use AND instead of WHERE
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

            // Fetch data from the provar table
            connection.query('SELECT * FROM provar', (err, provar) => {
                if (err) {
                    console.error('Error fetching products:', err);
                    res.status(500).send('Error fetching products');
                    return;
                }

                // Fetch data from the variant table
                connection.query('SELECT * FROM variant', (err, variant) => {
                    if (err) {
                        console.error('Error fetching products:', err);
                        res.status(500).send('Error fetching products');
                        return;
                    }

                    // Send the data, provar, and subData to the frontend
                    res.json({
                        message: 'Success',
                        data: data,
                        provar: provar,
                        variant: variant,
                        subData: subData // Include subData in the response
                    });
                });
            });
        } catch (error) {
            console.error("Error executing SQL query:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

