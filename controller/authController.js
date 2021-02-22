var User = require('../model/userModel');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var User = require('../model/userModel');

module.exports = {
    register: (req, res)=>{
        let error =[];
        var name ='';
        var username ='';
        var email ='';
        var password ='';
        var re_password ='';
        if(error.length < 0) error = 0;
        res.render('register',{
            title: 'CMS Register',
            error: error,
            name: name,
            username: username,
            email: email,
            password: password,
            re_password: re_password
        });
    },


    registerPost: (req, res)=>{
        let error = [];
        const name = req.body.name;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const re_password = req.body.repassword;

        /*if(!name){
            error.push({message: 'Name is Empty !!!'});
        }
        if(!username){
            error.push({message: 'Username is Empty !!!'});
        }
        if(!email){
            error.push({message: 'Email is Empty !!!'});
        }
        if(!password){
            error.push({message: 'Password is Empty !!!'});
        }
        if(!re_password){
            error.push({message: 'Retype the password!!!'});
        }
        if(password != re_password){
            error.push({message: 'Password is not match!!!'});
        }*/
        console.log(error);
        if(error.length >0){
            res.render('register',{
                title: 'CMS Register',
                error : error,
                name: name,
                username: username,
                email: email,
                password: password,
                re_password: re_password
            })
        } else {
            User.findOne({'username':username},function (err, user){
                if(err) throw err;

                if(user){
                    req.flash('error_message','User already exists');
                    res.redirect('/register');
                }
                else{
                    const _user = new User({
                        name : name,
                        username : username,
                        email : email,
                        password : password,
                        admin : 0
                    });
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(_user.password, salt, function(err, hash) {
                            _user.password = hash;
                            _user.save().then(user=>{
                                req.flash('success_message','User Recorded successfully');
                                res.redirect('/register');
                            })
                        });
                    });

                    /**/
                }
            })
        }

    },

    login: (req, res)=>{
        let error =[];
        var username = '';
        var password = '';
        if(error.length < 0) error.length = 0;

        if(res.locals.user) res.render('/');

        res.render('login',{
            title: 'CMS Login',
            error: error,
            username : username,
            password : password,
        });
    },


    loginPost: (req, res, next)=>{
        let error = [];
        const username = req.body.username;
        const password = req.body.password;

        if(!username){
            error.push({message: 'Username is Empty !!!'});
        }
        if(!password){
            error.push({message: 'Password is Empty !!!'});
        }

        console.log(error);
        if(error.length >0){
            res.render('login',{
                title: 'CMS Login',
                error : error,
                username : username,
                password : password,
            })
        } else {
            console.log(req.user);
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            })(req, res, next);
        }
    },

    logoutPost: function(req, res){
        req.logout();
        req.flash('success_message','You got exit nicely. Want to login !!!');
        res.redirect('/login');
    },
}