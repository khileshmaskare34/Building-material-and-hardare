var connection = require('../models/config')

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

        res.render('shop', {shop, category, subcategory});
        // console.log(results);
            })

        })
    
      });
}




// exports.shop_filter_by_category = (req, res) => {
//     let categoryId = req.params.categoryId;

//     let query = 'SELECT * FROM shop WHERE category_id='+categoryId
//     ;
    
//     connection.query(query, (err, shop) => {
//       if (err) {
//         console.error('error catid:', err);
//         res.status(500).send('cartId');
//         return;
//       }
//       connection.query('SELECT * FROM category', (err2, category)=>{
//         if(err2){
//             console.error('Error querying database:', err);
//             res.status(500).send('Error querying database');
//             return;
//         }

//         connection.query('SELECT * FROM sub_category', (err3, subcategory)=>{
//             if(err3){
//                 console.error('Error querying database:', err);
//                 res.status(500).send('Error querying database');
//                 return;
//             }
    
//       res.render('shop', { shop, category, subcategory });
//         })
//     })
//     });
// }


exports.shop_filter_by_category = (req, res) => {
    let categoryId = req.params.categoryId;

    let query = 'SELECT * FROM shop WHERE category_id='+categoryId;
    
    connection.query(query, (err, shop) => {
        if (err) {
            console.error('error catid:', err);
            res.status(500).send('Error querying database');
            return;
        }
        // Assuming you have a separate template for rendering products
        res.render('product_partial', { shop });
    });
}

// exports.shop_filter_by_subcategory = (req, res)=>{
//     let subcategoryId = req.params.subcategoryId;
//     console.log("sub--c"+subcategoryId)
// }

// exports.shop_filter_by_subcategory = (req, res) => {

//     let subcategoryId = req.params.subcategoryId;
   

//     console.log("khil"+subcategoryId)

//     let query = 'SELECT * FROM shop WHERE subcategory_id='+subcategoryId
//     ;
    
//     connection.query(query, (err, shop) => {
//       if (err) {
//         console.error('error subcart:', err);
//         res.status(500).send('error subcart');
//         return;
//       }
//       connection.query('SELECT * FROM category', (err2, category)=>{
//         if(err2){
//             console.error('Error querying database:', err);
//             res.status(500).send('Error querying database');
//             return;
//         }

//         connection.query('SELECT * FROM sub_category', (err3, subcategory)=>{
//             if(err3){
//                 console.error('Error querying database:', err);
//                 res.status(500).send('Error querying database');
//                 return;
//             }
    
//       res.render('shop', { shop, category, subcategory });
//         })
//     })
// })
// }

