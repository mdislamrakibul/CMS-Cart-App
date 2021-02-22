const Order = require('../../model/orderModel');

module.exports = {

    orders: (req, res)=>{

        Order.find({'o_username': req.user.username}).then(order=>{
            res.render('cms/orders',{
                title : 'CMS Cart',
                type_name : 'Orders List',
                orders: order,
            })
        });

    },

    changeStatus: (req, res)=>{
        const id = req.params.id;
        Order.findOne({'_id': id}).then(order=>{
            order.o_status = -1;
            order.save().then(_order => {
                req.flash('success_message','Your order status changed successfully to rejected. To make it active contact to admin!!!');
                res.redirect('/orders')
            })

        });
    }
}