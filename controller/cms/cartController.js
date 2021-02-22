const Category = require('../../model/categoryModel');
const Product = require('../../model/productModel');
const Order = require('../../model/orderModel');
const fs = require('fs-extra');
const fss = require('fs');
const resizeImg = require('resize-img');
const path = require('path');

var Publishable_Key = 'pk_test_51IIsAbGmZm2y53ypb2h6tEtmxaQ6inGxNUWZ4eVGE5sC74Pd5Vp28tbcwgPk9wxO3ss7hY2QuhtezhnRQev3X22Y00ZZiECEoT';
var Secret_Key = 'sk_test_51IIsAbGmZm2y53ypvJIRSaneax3FFVCHoGxzHXrwP5urxKyPAxu216ZLruNitbgxDWyky48TTm3et7CxmxVP7zFc009UMyb8nR';
const stripe = require('stripe')(Secret_Key);

module.exports = {


    addToCart : async (req, res) => {
        const slug = req.params.slug;
        var cat = await Category.find().then();
        console.log(slug);
        Product.findOne({'slug': slug}).then(prods => {
            console.log(prods);
            if (typeof req.session.cart == 'undefined') {
                req.session.cart = [];
                req.session.cart.push({
                    title: prods.title,
                    slug: prods.slug,
                    qty: 1,
                    price: parseFloat(prods.price).toFixed(2),
                    image: '/uploads/' + prods.id + '/' + prods.image
                });
            } else {
                var cart = req.session.cart;
                var newItem = true;
                for (var i = 0; i < cart.length; i++) {
                    if (cart[i].slug == slug) {
                        cart[i].qty++;
                        newItem = false;
                    }
                }
                if (newItem) {
                    cart.push({
                        title: prods.title,
                        slug: prods.slug,
                        qty: 1,
                        price: parseFloat(prods.price).toFixed(2),
                        image: '/uploads/' + prods.id + '/' + prods.image
                    });
                }
            }
            console.log(req.session.cart);
            req.flash('success_message', 'Cart Successfully Added');
            res.redirect('back');
        })
    },

    checkOut: async (req, res) => {
        console.log(req.session.cart);
        var cat = await Category.find().then();
        if (req.session.cart && req.session.cart.length < 1) {

            delete req.session.cart;
        }
        res.render('cms/checkout', {
            'title': 'Checkout',
            'type_name': 'Checkout',
            cart: req.session.cart,
            // key: Publishable_Key,
            category : cat

        })
        console.log(req.session.cart);
    },

    checkoutUpdate: (req, res)=>{

        const slug = req.params.slug;
        var cart = req.session.cart;
        var action = req.query.action;
        for(var i =0 ; i<cart.length ; i++){
            if(cart[i].slug == slug){
                switch (action){
                    case 'add':
                        cart[i].qty++;
                        break;
                    case 'minus':
                        cart[i].qty--;
                        if(cart[i].qty < 1 ) cart.splice(i,1);;
                        break;
                    case 'remove':
                        cart.splice(i,1);
                        if(cart.length == 0) delete req.session.cart;
                        break;
                    default:
                        console.log("Update Issue");
                }
                break;
            }
        }
        req.flash('success_message','Cart Successfully Updated');
        res.redirect('back');

    },

    cartClear: (req, res)=>{
        if(req.session.cart && req.session.cart.length > 0 ){
            delete req.session.cart;
        }
        req.flash('success_message','Cart Successfully Cleared');
        res.redirect('back');
        /*res.render('cms/checkout',{
            'title': 'Checkout',
            'type_name': 'Checkout',
            cart : req.session.cart,

        })*/
    },

    checkoutProcess: async (req, res) => {
        let  error =[];
        var cat = await Category.find().then();
        res.render('cms/checkout_process',{
            category: cat,
            'title' : 'Checkout Process',
            'type_name' : 'Checkout Process',
            key: Publishable_Key,
            error : error
        });
    },

    stripePayment : (req, res)=>{

/*        console.log(req.body.stripeEmail);
        console.log(req.body.stripeToken);*/
        var cart = req.session.cart;
        var total = 0;
        for(var i =0 ; i <cart.length ; i++){
            total += cart[i].qty * cart[i].price;
        }
        /*console.log(total);*/

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: req.user.name,
        address: {
            line1: 'Rasulpur, Jatrabari',
            postal_code: '1236',
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh',
        }
    })
        .then((customer) => {
            return stripe.charges.create({
                amount: (total*100),
                description: 'Online Buy',
                currency: 'Usd',
                customer: customer.id
            });
        })
        .then((charge) => {
            if(req.session.cart && req.session.cart.length > 0 ){
                delete req.session.cart;
            }
            req.flash('success_message','Thank You for Purchase. Happy Shopping. You will be contacted shortly');
            res.redirect('/');
            // res.send('success');
        })
        .catch((err) => {
            res.send(err)    // If some error occurs
        });
    },

    COD: async (req, res) => {
        let error = [];
        const name = req.body.name;
        const email = req.body.email;
        const address = req.body.address;
        const cell = req.body.cell;
        if (!name) {
            error.push({message: 'Name is Empty !'});
        }
        if (!email) {
            error.push({message: 'Email is Empty !'});
        }
        if (!address) {
            error.push({message: 'Address is Empty !'});
        }
        if (!cell) {
            error.push({message: 'Cell No. is Empty !'});
        }
        if (error.length > 0) {
            var cat = await Category.find().then();
            res.render('cms/checkout_process',{
                category: cat,
                'title' : 'Checkout Process',
                'type_name' : 'Checkout Process',
                key: Publishable_Key,
                error : error
            });
        }
        else {
            var cart = req.session.cart;
            var total = 0;
            var list = [];
            for(var i =0 ; i <cart.length ; i++){
                total += cart[i].qty * cart[i].price;
                list.push(cart[i].title.concat('(').concat(cart[i].qty).concat(') - $').concat(cart[i].price)
                    .concat(' - $').concat((cart[i].qty * cart[i].price).toFixed(2)));
            }
            var _order = new Order();
            _order.o_name = name;
            _order.o_username = req.user.username;
            _order.o_email = email;
            _order.o_address = address;
            _order.o_cellNo = cell;
            _order.o_list = list;
            _order.o_total = total;
            _order.o_status = 0;
            _order.save().then (_order =>{
                console.log(_order);
                if(req.session.cart && req.session.cart.length > 0 ){
                    delete req.session.cart;
                }
                req.flash('success_message','Your Order has been successfully sent for evaluation. Our team will get back to you shortly...');
                res.redirect('/');
                /*req.session.destroy(function(err) {
                    if(err) throw (err);

                });*/

            })
            console.log(list);
        }

    }
}
