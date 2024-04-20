// 定义模式
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const formatSchema = new Schema({
    title: String,
    price: Number,
    cost: Number,
    stock: Number,
    color: [String] 
});
const productSchema = new Schema({
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
        ref: 'Sellers' // 已經有在models/seller.js 定義，所以這邊可以直接引用
    },
    fare: Number,
    pay: Number,
    keyword:Array
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
