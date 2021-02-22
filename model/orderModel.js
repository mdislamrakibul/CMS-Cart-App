var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const orderSchema = new Schema({
    o_name: {
        type: String,
        required: true
    } ,
    o_username: {
        type: String,
        required: true
    } ,
    o_email: {
        type: String,
        required: true
    } ,
    o_address: {
        type: String,
        required: true
    } ,
    o_cellNo: {
        type: String,
        required: true
    } ,
    o_list: {
        type: Array,
        required: true
    } ,
    o_total: {
        type: "Number",
        required: true
    } ,
    o_status: {
        type: "Number",
        required: true
    } ,

    created_time:{
        type: Date,
        default: Date.now()
    }
});
const Order = module.exports = mongoose.model('Order', orderSchema);