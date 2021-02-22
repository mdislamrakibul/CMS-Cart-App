var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    } ,
    email: {
        type: String,
        required: true
    } ,
    username: {
        type: String,
        required: true
    } ,
    password: {
        type: String,
        required: true
    } ,
    admin: {
        type: Number,
    } ,

    created_time:{
        type: Date,
        default: Date.now()
    }
});
const User = module.exports = mongoose.model('User', userSchema);