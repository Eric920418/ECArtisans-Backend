// 定義模式
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formatSchema = new Schema({
	title: {
		type: String,
		required: [true, '請輸入品項名稱'],
	},
	price: {
		type: Number,
		required: [true, '請輸入價格'],
	},
	cost: {
		type: Number,
		required: [true, '請輸入成本'],
	},
	stock: {
		type: Number,
	},
	color: [String],
});
const productSchema = new Schema(
	{
		sellerOwned: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Sellers',
		},
		productName: {
			type: String,
			required: [true, '必須填寫商品名稱'],
		},
		sellerCategory: [
			{
				type: String,
				enum: [
					'娛樂',
					'服飾',
					'3C產品',
					'食品',
					'家具',
					'運動',
					'寵物',
					'生活用品',
					'清潔用品',
				],
				required: [true, '必須選擇總類別'],
			},
		],
		//商家自訂義類別
		category: [
			{
				type: String,
				required: [true, '必須填寫商品分類'],
			},
		],
		origin: {
			type: String,
		},
		ingredient: {
			type: String,
		},
		format: [formatSchema],
		introduction: {
			type: String,
		},
		production: {
			type: String,
		},
		isOnshelf: {
			type: Boolean,
			default: false,
		},
		fare: {
			type: Number,
		},
		pay: [
			{
				type: String,
				enum: ['信用卡付款', 'ATM匯款', '店到店付費'],
				required: [true, '請至少提供一種支付方式'],
			},
		],
		keyword: {
			type: [String],
		},
		img: [
			{
				type: String,
			},
		],
		createAt: {
			type: Date,
			default: Date.now,
			select: false,
		},
		updateAt: {
			type: Date,
			default: Date.now,
			select: false,
		},
	},
	{
		versionKey: false,
	}
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
