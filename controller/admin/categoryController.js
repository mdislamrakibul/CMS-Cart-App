const Category = require('../../model/categoryModel');
const Product = require('../../model/productModel');
/*const fs = require('fs-extra');
const fss = require('fs');
const resizeImg = require('resize-img');*/
const path = require('path');
module.exports = {

    index : function (req, res) {
        Category.find().then(category => {
            /*console.log("Category : "+category);*/
            res.render('admin/category/home',{
                'title': 'CMS Admin',
                category: category,
            });
        })
    },

    categoryCreate: (req, res) =>{
        let error = [];
        res.render('admin/category/create',{
            'title': 'CMS Admin',
            error : error
        });
    },

    categoryCreatePost: (req, res) =>{
        let error = [];
        const title = req.body.title;
        const slug = req.body.slug;

        if(!title){
            error.push({message: 'Title is Empty !'});
        }
        if(!slug){
            error.push({message: 'Slug is Empty !'});
        }
        if(error.length > 0){
            console.log(error);
            res.render('admin/category/create',{
                title: 'CMS Admin',
                error: error,
            });
        }
        else{
            Category.findOne({'slug':slug}).then(existingCat => {
                if(existingCat){
                    error.push({message: 'Title Already Exists'});
                    req.flash('error_message','Title Already Exists');
                    res.render('admin/category/create',{
                        title: 'CMS Admin',
                        error: error,
                        title : req.body.title,
                        slug : req.body.slug,
                    });
                } else {
                    const _newCategory = new Category({
                        title: title,
                        slug: slug
                    })
                    _newCategory.save().then(category =>{
                        req.flash('success_message','Record Saved Successfully');
                        res.redirect('/admin/category/create');
                    });
                }
            })
        }
    },

    categoryEdit: (req, res)=>{
        let error = [];
        const slug = req.params.slug;
        Category.findOne({'slug':slug}).then(editedCategory => {
            console.log("Category : "+editedCategory);
            res.render('admin/category/edit',{
                'title': 'Category-Edit',
                error : error,
                'category': editedCategory,
            });
        })
    },

    categoryUpdatePost: (req, res) => {
        let error = [];
        const title = req.body.editTitle;
        const slug = req.body.editSlug;
        const postSlug = req.params.slug;
        const id = req.body.editId;
        console.log(title);
        console.log(slug);
        console.log(id);
        if(!title){
            error.push({message: 'Title is Empty !'});
        }
        if(!slug){
            error.push({message: 'Slug is Empty !'});
        }
        if(error.length > 0){
            console.log(error);
            req.flash('error_message','Fields are empty !!!');
            res.redirect(`/admin/category/edit/${postSlug}`);
        }
        else{
            Category.findOne({'slug':slug}).then(existingCat => {
                if(existingCat){
                    console.log(id);
                    // error.push({message: 'Title Already Exists'});
                    req.flash('error_message','Title Already Exists');
                    res.redirect(`/admin/category/edit/${slug}`);
                /*,{
                        /!*error: error,
                        editTitle : req.body.editTitle,
                        editSlug : req.body.editSlug,*!/
                    }*/
                } else {
                    Category.findById(id).then(updateCat =>{
                        updateCat.title = title;
                        updateCat.slug = slug;
                        updateCat.save().then(category =>{
                            req.flash('success_message','Record Updated Successfully');
                            res.redirect('/admin/category');
                        });
                    });
                }
            })
        }
    },

    categoryDelete: (req, res) =>{
        const slug = req.params.slug;
        console.log(slug);
        Category.findOne({'slug':slug})
            .then(deletedCategory => {
                Category.findByIdAndRemove(deletedCategory._id).then(cat =>{
                    console.log('Deleted Category ' +deletedCategory._id);
                    req.flash('success_message', `The Category ${deletedCategory.title} has been deleted.`);
                    res.redirect('/admin/category');
                })

            });
    }
}
