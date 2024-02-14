var connection = require('../models/config')


exports.shop = (req, res)=>{
    
    if(categoryId){

    }
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




exports.shop_filter_by_category = (req, res) => {
    // let categoryId = req.params.;
    let categoryId = req.params.categoryId;

    console.log("khil"+categoryId)

    let query = 'SELECT * FROM shop WHERE category_id='+categoryId
    ;
    
    // if (categoryId) {
    //   query += ` WHERE shop.category_id = ${categoryId}`;
    // }
  
    connection.query(query, (err, shop) => {
      if (err) {
        console.error('error catid:', err);
        res.status(500).send('cartId');
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
    
      res.render('shop', { shop, category, subcategory });
        })
    })
    });
}

exports.shop_filter_by_subcategory = (req, res) => {
    let categoryId = req.params.categoryId;
    let subcategoryId = req.params.subcategoryId;
    let query = 'SELECT shop.*, category.category_name, sub_category.subcategory_name FROM shop INNER JOIN category ON shop.category_id = category.id INNER JOIN sub_category ON shop.subcategory_id = sub_category.id';
    
    if (categoryId && subcategoryId) {
      query += ` WHERE shop.category_id = ${categoryId} AND shop.subcategory_id = ${subcategoryId}`;
    } else if (categoryId) {
      query += ` WHERE shop.category_id = ${categoryId}`;
    }
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send('Error querying database');
        return;
      }
  
      res.render('shop', { results });
    });
}

