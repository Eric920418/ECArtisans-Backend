const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
    
bossName :String,
gender: String,
phone:String,
mail:String,
brand:String,
avatar:String,
plan:Number,
planPeriod:String,
password: String,
otherPassword:String,
address:String,
introduce:String,
salesType:Array,
member:Array,
discount:Array,
activity:Array,
order:Array,
product:Array,
collection:String,
chat:Array 
},{ suppressReservedKeysWarning: true })

const Seller = mongoose.model('Sellers', SellerSchema);

module.exports = Seller;  