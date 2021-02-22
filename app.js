/*packages*/
const express = require('express'); /*express*/
const app = express();
const mongoose = require('mongoose'); /*Mongoose*/
const session = require('express-session'); /*Session*/
const flash = require('connect-flash'); /*flash*/
const cookieParser = require('cookie-parser'); /*cookie*/
const path = require('path'); /*path*/
const bodyParser = require('body-parser'); /*body-parser*/
const ejs = require('ejs'); /*ejs*/
const fileUpload = require('express-fileupload'); /*express-fileupload*/
var passport = require('passport'); /*passport*/
/*var expressValidator = require('express-validator');/!*express-validator*!/
app.use(expressValidator());*/
/*packages*/

var Publishable_Key = 'pk_test_51IIsAbGmZm2y53ypb2h6tEtmxaQ6inGxNUWZ4eVGE5sC74Pd5Vp28tbcwgPk9wxO3ss7hY2QuhtezhnRQev3X22Y00ZZiECEoT';
var Secret_Key = 'sk_test_51IIsAbGmZm2y53ypvJIRSaneax3FFVCHoGxzHXrwP5urxKyPAxu216ZLruNitbgxDWyky48TTm3et7CxmxVP7zFc009UMyb8nR';
const stripe = require('stripe')(Secret_Key);

/*start Server(2)*/
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is started on http://localhost:'+ port)
})
/*start Server(2)*/

/*connect database(3)*/
const config = require('./config/db');
mongoose.connect(config.database,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to DB");
});
/*connect database(3)*/


/*Session, flash message (4)*/
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(flash());

/*Passport (10)*/
require('./config/passport') (passport);
app.use(passport.initialize());
app.use(passport.session());
/*Passport (10)*/


app.use('/*',function  (req, res, next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
})


app.use(function(req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    next();
});
app.get("/test-session", function(req, res){

    req.session.name = 'GeeksforGeeks'
    return res.send("Session Set")
})
app.get("/get-test-session", function(req, res){
    var name = req.session.name
    return res.send(name)
    /*  To destroy session you can use
        this function
     req.session.destroy(function(error){
        console.log("Session Destroyed")
    })
    */
})
/*Session, flash message (4)*/

/*path, express encode (5)*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
/*path, express encode (5)*/

/*body parser middleware(6)*/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
/*body parser middleware(6)*/


/*view engine setup(7)*/
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
/*view engine setup(7)*/

/*File upload (9)*/
app.use(fileUpload());


/*task for stripe*/
app.get("/stripe", function(req, res){

    res.render("stripe",{
        title: 'Stripe Test',
        key: Publishable_Key
    })
})
app.post('/payment', function(req, res){

    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gautam Sharma',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '110092',
            city: 'New Delhi',
            state: 'Delhi',
            country: 'India',
        }
    })
        .then((customer) => {

            return stripe.charges.create({
                amount: 7000,    // Charing Rs 25
                description: 'Web Development Product',
                currency: 'USD',
                customer: customer.id
            });
        })
        .then((charge) => {
            console.log(charge);
            res.send("Success") // If no error occurs
        })
        .catch((err) => {
            res.send(err)    // If some error occurs
        });
})

/*task for stripe*/



/*router setup (8)*/
const cmsRouter = require('./route/cmsRoute');
const adminRouter = require('./route/adminRoute');
app.use('/',cmsRouter);
app.use('/admin',adminRouter);
/*router setup (8)*/







