// 定义模式
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({});
const Sellers = mongoose.model('Sellers', sellerSchema);


const formatSchema = new mongoose.Schema({
    title: String,
    price: Number,
    cost: Number,
    stock: Number,
    color: [String] 
});
const productSchema = new mongoose.Schema({
    productName: String,
    img: String,
    type: Array,
    sellerType: Number,
    origin: String,
    ingredient: String,
    format: [formatSchema],
    introduce: String,
    production:String,
    state: Boolean,
    evaluate: Array,
    haveStore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sellers'
    },
    fare: Number,
    pay: Number,
    keyword:Array
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
