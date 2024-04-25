const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
bossName :{type:String,default:"",require:[true]},
gender: {type:String,default:""},
phone:{type:String,default:"",require:[true]},
mail:{type:String,default:"",require:[true]},
brand:{type:String,default:"",require:[true]},
avatar:{type:String,default:""},
plan:{type:Number,default:1},
planPeriod:{type:String,default:""},
password: {type:String,default:"",require:[true],select:false},
otherPassword:{type:String,default:"123456"},
address:{type:String,default:""},
introduce:{type:String,default:""},
salesType:Array,
member:Array,
discount:Array,
activity:Array,
order:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders' 
}],
product:Array,
collection:{type:String,default:""},
chat:Array 
},{ suppressReservedKeysWarning: true })

const Seller = mongoose.model('Sellers', SellerSchema);

module.exports = Seller;  