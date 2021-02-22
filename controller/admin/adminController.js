const Category = require('../../model/categoryModel');
const Product = require('../../model/productModel');
const Order = require('../../model/orderModel');
const User = require('../../model/userModel');
/*const fs = require('fs-extra');
const fss = require('fs');
const resizeImg = require('resize-img');*/
const path = require('path');
module.exports = {

    index : async function (req, res) {
        const cat = await Category.find().then();
        const prod = await Product.find().then();
        const order = await Order.find().then();
        const user = await User.find().then();
        res.render('admin/home',{
            'title' : 'CMS Admin',
            cat: cat,
            prod: prod,
            order: order,
            user: user
        })
    },

    logoutPost: function(req, res){
        // req.session.destroy();
        // delete req.session;
        console.log("Cart : "+ req.session.cart);

        req.logout();
        if(req.session.cart && req.session.cart.length > 0 ){
            delete req.session.cart;
        }
        req.flash('success_message','You got exit nicely. Want to login !!!');
        res.redirect('/login');
        /*req.session.destroy(function(err) {

        })*/

    },
}
