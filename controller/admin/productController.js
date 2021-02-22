const Category = require('../../model/categoryModel');
const Product = require('../../model/productModel');
const fs = require('fs-extra');
const fss = require('fs');
const resizeImg = require('resize-img');
const path = require('path');
module.exports = {

    index : function (req, res) {
        Product.find(function(err, product){
            res.render('admin/product/home',{
                title: 'Product',
                product: product
            });
        })
    },

    productCreate : (req, res) => {
        let error = [];
        Category.find().then(cat=>{
            res.render('admin/product/create',{
                title : 'CMS Admin',
                error : error,
                category : cat
            });
        })
    },

    productCreatePost: (req, res) => {
        let error = [];
        const title = req.body.productTitle;
        const slug = req.body.productSlug;
        const description = req.body.productDescription;
        const price = req.body.productPrice;
        const category = req.body.productCategory;
        let filename = '';

        if(!title){
            error.push({message: 'Title is Empty !'});
        }
        if(!slug){
            error.push({message: 'Slug is Empty !'});
        }
        if(!description){
            error.push({message: 'Description is Empty !'});
        }
        if(!price){
            error.push({message: 'Price is Empty !'});
        }
        if(!category){
            error.push({message: 'Category is Empty !'});
        }
        if(!req.files){
            error.push({message: 'Image File is Empty !'});
        }

        if(error.length > 0){
            console.log(error);
            console.log(req.body.productTitle + slug+description+category+price );
            Category.find().then(cat=>{
                res.render('admin/product/create',{
                    title : 'Product-Create',
                    error: error,
                    productTitle : title,
                    productSlug : slug,
                    productCategory : req.body.productCategory,
                    productDescription : req.body.productDescription,
                    productPrice : req.body.productPrice,
                    category : cat
                });
            })

        }
        else{
            Product.findOne({'slug':slug}).then(Prod => {
                if(Prod){
                    error.push({message: 'Title Already Exists'});
                    Category.find().then(cat=>{
                        res.render('admin/product/create',{
                            title : 'Product-Create',
                            error: error,
                            productTitle : title,
                            productSlug : slug,
                            productCategory : category,
                            productDescription : description,
                            productPrice : price,
                            category : cat
                        });
                    })
                } else {
                    let file = req.files.productImage;
                    let extName = path.extname(file.name);
                    filename = slug+'-'+file.size+extName;
                    const _newProd = new Product({
                        title: title,
                        slug: slug,
                        description: description,
                        price: price,
                        category: category,
                        // image: `/uploads/${filename}`,
                        image: filename,
                    })

                    _newProd.save().then(product =>{
                        fs.mkdirp('public/uploads/'+product._id).then(err =>{
                            console.log(err);
                        });
                        fs.mkdirp('public/uploads/'+product._id+'/gallery').then(err =>{
                            console.log(err);
                        });
                        fs.mkdirp('public/uploads/'+product._id+'/gallery/thumbs').then(err =>{
                            console.log(err);
                        });

                        let uploadDir = './public/uploads/'+product._id+'/';
                        file.mv(uploadDir+filename, (err) => {
                            if (err)
                                throw err;
                        });
                        req.flash('success_message','Record Saved Successfully');
                        res.redirect('/admin/product');
                    });
                }
            })
        }
    },

    productEdit : (req, res)=>{
        let error = [];
        const slug = req.params.slug;
        Category.find().then(cat=>{
            Product.findOne({'slug':slug}).then(editedProduct => {
                console.log("Product : "+editedProduct);
                // const galleryDir = '/public/uploads/'+editedProduct._id+'/gallery/thumbs';
                // let galleryImage = null;
                // fss.readdir(galleryDir, function (err, files) {
                //     if(err){
                //         return console.log(err);
                //     } else {
                //         galleryImage = files;
                        res.render('admin/product/edit',{
                            'title': 'Product-Edit',
                            'category': cat,
                            'prod': editedProduct,
                            error : error,
                            productCategoryEdit : editedProduct.category.replace(/\s+/g,'-').toLowerCase(),
                            // galleryImage: galleryImage,
                        });
                    // }
                // })
            })
        })

    },

    productUpdatePost : async (req, res)=>{
        let filename="";
        let error = [];
        let category = '';
        let prevFilename = '';
        let newFilename = '';
        const title = req.body.editTitle;
        const id = req.body.editId;
        const slug = req.body.editSlug;
        const desc = req.body.editDesc;
        const price = req.body.editPrice;
        const oldCategory = req.body.selectedCategory;
        const newCategory = req.body.editCategory;
        const files = req.files;

        const prod = await Product.findById(id);
        /*
                if(!title){
                    error.push({message: 'Title is Empty !'});
                }
                if(!slug){
                    error.push({message: 'Slug is Empty !'});
                }
                if(!desc){
                    error.push({message: 'Description is Empty !'});
                }
                if(!price){
                    error.push({message: 'Price is Empty !'});
                }*/
        if(!newCategory){
            category = oldCategory;
        } else {
            category = newCategory;
        }
        if(!req.files){
            prevFilename = prod.image;

        } else {
            let file = req.files.editImage;
            let extName = path.extname(file.name);
            newFilename = slug+'-'+file.size+extName;

        }

        if(error.length > 0) {
            console.log(error);
            Category.find().then(cat => {
                console.log("Url - "+`/admin/product/edit/${prod.slug}`);
                res.redirect(`/admin/product/edit/${prod.slug}`);
            })
        } else {
            console.log(id +" "+ title +" "+ slug +" "+ desc +" "+ category +" "+ price +" prevFilename- "+ prevFilename+" newFilename - "+newFilename);
            console.log('all data came');
            Product.findById(id).then(editProd =>{
                editProd.title = title;
                editProd.slug = slug;
                editProd.description = desc;
                editProd.price = price;
                editProd.category = category;
                if(newFilename != ""){
                    editProd.image = newFilename;
                } else {
                    editProd.image = prevFilename;
                }
                if( newFilename != "" ){
                    console.log("newFilename 11111111111111111");
                    fs.remove('/public/uploads/' + editProd._id , function(err) {
                        if (err) {
                            throw err
                        } else {
                            console.log("Successfully deleted the file.")
                        }
                    });

                    let file = req.files.editImage;
                    let extName = path.extname(file.name);
                    filename = slug+'-'+file.size+extName;

                    let uploadDir = './public/uploads/' + editProd._id + '/'+ filename;
                    file.mv(uploadDir, (err) => {
                        if (err)
                            throw err;
                    });
                };
                editProd.save().then(product => {
                    console.log("Successfully Saved the file.")
                    req.flash('success_message', 'Record Updated Successfully');
                    res.redirect('/admin/product');
                });


            })
        }
    },

    productUploadGallery :(req, res)=>{

        console.log(req.files);

        var images = req.files.file;
        var id = req.params.id;
        console.log(id);

        var path = './public/uploads/'+id+'/gallery/'+images.name;
        var thumb_path = './public/uploads/'+id+'/gallery/thumbs/'+images.name;
        images.mv(path,function(err){
            if(err)
            {
                throw err;
            }
            resizeImg(fss.readFileSync(path),{width:150, height:100}).then(function (buf) {
                fss.writeFileSync(thumb_path,buf);
            });
        })
        res.sendStatus(200);
    },

    productDelete : (req, res)=>{
        const slug = req.params.slug;
        console.log(slug);
        Product.findOne({'slug':slug})
            .then(deletedProduct => {
                Product.findByIdAndRemove(deletedProduct._id).then(cat =>{
                    console.log('Deleted Product ' +deletedProduct._id);
                    req.flash('success_message', `The Product ${deletedProduct.title} has been deleted.`);
                    res.redirect('/admin/product');
                })

            });
    },
}
