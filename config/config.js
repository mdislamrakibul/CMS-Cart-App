module.exports = {
    isUserAuthenticated: (req, res, next)=>{
        if(req.isAuthenticated()){
            next();
        }
        else {
            req.flash('error_message','Please process as an user !!!!');
            res.redirect('/login');
        }
    },


    isAdminAuthenticated: (req, res, next)=>{
        // console.log(res.locals.user);
        if(req.isAuthenticated() && res.locals.user.admin == 1){
            next();
        }
        else {
            req.flash('error_message','Please process as an admin !!!!');
            res.redirect('/login');
        }
    },
    isBannedAuthenticated: (req, res, next)=>{
        console.log(res.locals.user);
        if(req.isAuthenticated() && res.locals.user.admin == -1){
            next();
        }
        else {
            req.flash('error_message','This User has been banned. Plaease contact to admin !!!!');
            res.redirect('/login');
        }
    }


}