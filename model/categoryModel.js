var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    } ,
    slug: {
        type: String,
        required: true
    } ,

    created_time:{
        type: Date,
        default: Date.now()
    }
});
const Category = module.exports = mongoose.model('Category', categorySchema);