const Order = require('../../model/orderModel');

module.exports ={
    orders:(req, res)=>{

        Order.find().then(order =>{
            res.render('admin/order/home',{
                title: 'CMS Admin',
                orders: order
            });
        })

    },
    statusAction: (req, res)=>{
        const id = req.params.id;
        const val = req.body.s_change;
        console.log(id);
        console.log(val);
        Order.findOne({'_id': id}).then(order =>{
            order.o_status = val;
            order.save().then(_order=>{
                req.flash('success_message','Your order status changed successfully !!!');
                res.redirect('/admin/orders');
            })

        })
    }
}