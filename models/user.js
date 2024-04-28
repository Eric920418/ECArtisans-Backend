const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
<<<<<<< HEAD
    name: {type: String, default: "", require: [true]},
    gender: {type: String, default: "", require: [true]},
    avatar: {type: String, default: "" } ,
    birthday: {type: String, default: "", require: [true]},
    phone: {type: String, default: "", require: [true]},
    mail: {type: String, default: "", require: [true]},
    address: {type: String, default: "", require: [true]},
    password: {type: String, default: "", require: [true], select: false},
    otherPassward: {type: String, default: "123456"},
=======
    name: String,
    gender: String,
    avatar: String,
    birthday: String,
    phone: String,
    mail: String,
    address: String,
    passward: String,
    otherPassword:{type:String,default:"12345678"},
>>>>>>> dc8fbef (test: 💍 所有使用者備用密碼完成)
    discount: Array,
    spHistory: Array,
    likeShop: Array,
    collect: Array,
    chat: Array,
})

 const User = mongoose.model('Users', userSchema);

module.exports = User;  