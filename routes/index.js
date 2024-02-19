var express = require('express');
var router = express.Router();

var connection = require("../models/config");
const { shop,  shop1, category_by_filter, subcategory_by_filter, allcat, shop_filter_by_category } = require('../controllers/shop');
const { productId } = require('../controllers/product');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/shop',  shop);

router.get('/shopp', shop1);

router.get('/product/:id', productId);


// router.get('/shop/:categoryId?', shop_filter_by_category);


router.get('/category', category_by_filter)

router.get('/subcategory', subcategory_by_filter)

router.get('/allcat', allcat)











router.get('/cart', (req, res)=>{
  res.render('cart');
})

router.get('/get-started', (req, res)=>{
  res.render('get_started')
})

module.exports = router;
