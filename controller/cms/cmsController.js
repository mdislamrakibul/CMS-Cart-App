const Category = require('../../model/categoryModel');
const Product = require('../../model/productModel');
const fs = require('fs-extra');
const fss = require('fs');
const resizeImg = require('resize-img');
const path = require('path');
module.exports = {

    index : async function (req, res) {
        var cat = await Category.find().then();
        Product.find().then(prods => {
            // console.log(prods);
            res.render('cms/home', {
                'title': 'CMS Cart',
                'cat_name': '',
                'type_name': 'Products',
                products: prods,
                category: cat
            });
        });
    },

    productByCategory: async (req, res) => {
        var slug = req.params.slug;
        var cat = await Category.find().then();
        Category.findOne({'slug': slug}).then(cats => {
            Product.find({'category': cats.slug}).then(prods => {
                // console.log(prods);
                res.render('cms/home', {
                    'title': 'CMS Cart',
                    'type_name': 'Products Category',
                    'cat_name': cats.slug,
                    products: prods,
                    category: cat
                });
            })
        })

    },

    productDetail: async (req, res) => {
        var cat = await Category.find().then();
        var slug = req.params.slug;
        var galleyImages = null;
        Product.findOne({'slug': slug}).then(prods => {
            // console.log(prods);
            /*var galleryDir = "public/uploads/" + prods._id + "/gallery/thumbs";*/
            // fss.readdir(galleryDir, function (err, file) {
            //     if (err)
            //         throw err;
            //     else {
            //         galleyImages = file;
                    res.render('cms/product_details', {
                        'title': 'CMS Cart',
                        'type_name': 'Product Details',
                        products: prods,
                        // galleyImages: galleyImages,
                        category: cat
                    });
                // }
            })
        })
    },
}
