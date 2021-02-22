var express = require('express')
var router = express.Router()
var productController = require('../controller/admin/productController');
var adminController = require('../controller/admin/adminController');
var categoryController = require('../controller/admin/categoryController');
var orderController = require('../controller/admin/orderController');
var userController = require('../controller/admin/userController');
const {isUserAuthenticated} = require('../config/config');
const {isAdminAuthenticated} = require('../config/config');
// middleware that is specific to this router
router.use('/*',isAdminAuthenticated,function timeLog (req, res, next) {
    next();
})

router.get('/', adminController.index)
router.route('/logout').get(adminController.logoutPost);

/*Category*/
router.route('/category').get(categoryController.index);
router.route('/category/create').get(categoryController.categoryCreate);
router.route('/category/create').post(categoryController.categoryCreatePost);
router.route('/category/edit/:slug').get(categoryController.categoryEdit)
router.route('/category/update/:slug').post(categoryController.categoryUpdatePost)
router.route('/category/delete/:slug').get(categoryController.categoryDelete)

/*Product*/
router.route('/product').get(productController.index);
router.route('/product/create').get(productController.productCreate)
router.route('/product/create').post(productController.productCreatePost)
router.route('/product/delete/:slug').get(productController.productDelete)
router.route('/product/edit/:slug').get(productController.productEdit)
router.route('/product/update/:id').post(productController.productUpdatePost)
router.route('/product/upload-gallery/:id').post(productController.productUploadGallery)

/*order*/
router.route('/orders').get(orderController.orders);
router.route('/status-action/:id').post(orderController.statusAction);

/*user*/
router.route('/users').get(userController.users);
router.route('/change-user/:id').post(userController.changeUser);


module.exports = router