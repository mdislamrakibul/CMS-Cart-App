var express = require('express')
var router = express.Router()
var cmsController = require('../controller/cms/cmsController');
var cartController = require('../controller/cms/cartController');
var authController = require('../controller/authController');
var orderController = require('../controller/cms/orderController');
const {isUserAuthenticated} = require('../config/config');
const {isBannedAuthenticated} = require('../config/config');

router.use('/checkout-process',isUserAuthenticated,function timeLog (req, res, next) {
    next();
})
router.use('/orders',isUserAuthenticated,function timeLog (req, res, next) {
    next();
})
router.use('/cash-on-delivery',isUserAuthenticated,function timeLog (req, res, next) {
    next();
})

/*router.use('/checkout-process',isBannedAuthenticated,function timeLog (req, res, next) {
    next();
})*/

router.route('/').get(cmsController.index);
router.route('/product-by-category/:slug').get(cmsController.productByCategory);
router.route('/product-detail/:slug').get(cmsController.productDetail);

// cart
router.route('/add-to-cart/:slug').get(cartController.addToCart);
router.route('/checkout',).get(cartController.checkOut);
router.route('/cart/update/:slug').get(cartController.checkoutUpdate);
router.route('/cart/clear').get(cartController.cartClear);
router.route('/stripe-payment').post(cartController.stripePayment);
router.route('/checkout-process').get(cartController.checkoutProcess);
/*need to add user auth in checkout processs route*/
router.route('/cash-on-delivery').post(cartController.COD);


// auth
router.route('/register').get(authController.register);
router.route('/register').post(authController.registerPost);
router.route('/login').get(authController.login);
router.route('/login').post(authController.loginPost);
router.route('/logout').get(authController.logoutPost);

// order
router.route('/orders').get(orderController.orders);
router.route('/change-status/:id').get(orderController.changeStatus);


module.exports = router