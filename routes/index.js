var express = require('express');
var router = express.Router();

var connection = require("../models/config");
const { shop, shop_category_subcategory_ids, shop_filter_by_subcategory, shop_filter_by_category, shop1 } = require('../controllers/shop');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/product', (req, res)=>{
  connection.query('SELECT * FROM product', (err, results)=>{
      if(err){
          console.error('Error fetching products:', err);
          res.status(500).send("Error");
      } else {
          console.log("Products retrieved successfully:", results);
          res.render('product',{results });
      }
  });
});


router.get('/shop',  shop);

router.get('/shopp', shop1);



router.get('/shop/:categoryId?', shop_filter_by_category);

// router.get('/shop/:subcategoryId?', shop_filter_by_category);






// router.get('/shop/:categoryId?', (req, res) => {
//   let categoryId = req.params.categoryId;
//   let query = 'SELECT shop.*, category.category_name, sub_category.subcategory_name FROM shop INNER JOIN category ON shop.category_id = category.id INNER JOIN sub_category ON shop.subcategory_id = sub_category.id';
  
//   if (categoryId) {
//     query += ` WHERE shop.category_id = ${categoryId}`;
//   }

//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error('Error querying database:', err);
//       res.status(500).send('Error querying database');
//       return;
//     }

//     res.render('shop', { results });
//     console.log(results);
//   });
// });









router.get('/cart', (req, res)=>{
  res.render('cart');
})

module.exports = router;
