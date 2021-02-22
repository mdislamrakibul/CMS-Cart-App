var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    } ,
    slug: {
        type: String,
        required: true
    } ,
    description: {
        type: String,
        required: true
    } ,
    category: {
        type: String,
        required: true
    } ,
    price: {
        type: Number,
        required: true
    } ,
    image: {
        type: String,
        required: true
    } ,

    created_time:{
        type: Date,
        default: Date.now()
    }
});
const Product = module.exports = mongoose.model('Product', productSchema);