const User = require('../../model/userModel');

module.exports = {

    users: (req,res)=>{
        User.find().then(user=>{
            res.render('admin/user/home',{
                title : 'CMS Cart',
                type_name : 'User List',
                users: user,
            })
        });
    },
    changeUser: (req, res)=>{
        const id = req.params.id;
        const val = req.body.u_status;

        User.findOne({'_id':id}).then(user =>{
            user.admin = val;
            user.save().then(_user=>{
                req.flash('success_message','User Status changed successfully!!!');
                res.redirect('/admin/users');
            })
        })
    }
}