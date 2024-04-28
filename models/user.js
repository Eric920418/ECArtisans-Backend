const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    gender: String,
    avatar: String,
    birthday: String,
    phone: String,
    mail: String,
    address: String,
    passward: String,
    otherPassword:{type:String,default:"12345678"},
    discount: Array,
    spHistory: Array,
    likeShop: Array,
    collect: Array,
    chat: Array,
})

 const User = mongoose.model('Users', userSchema);

module.exports = User;  