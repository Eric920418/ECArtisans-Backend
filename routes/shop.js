let express = require('express');
let router = express.Router();
const shopControllers = require('../controllers/shopControllers.js');

const Seller = require('../models/seller.js');
const Order = require('../models/order.js');

const isAuth = require('../middlewares/isAuth.js'); //將Auth驗證放到middleware 如果有其他地方需要可以共用

const bcrypt = require('bcrypt'); //加密套件

//商家導覽
router.get('/:seller_id/home', async (req, res, next) => {
	const headers = {
		'Access-Control-Allow-Headers':
			'Content-Type, Authorization, Content-Length, X-Requested-With',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
		'Content-Type': 'application/json',
	};
	try {
		const seller = req.params.seller_id;
		const thisShop = await Seller.findOne({ _id: seller });
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: 'success',
				thisShop,
			})
		);
		res.end();
	} catch (err) {
		res.writeHead(500, headers);
		res.end(
			JSON.stringify({
				status: 'error',
				message: 'Internal Server Error',
			})
		);
	}
});
//商家資訊
router.get('/:seller_id/information', async (req, res, next) => {
	const headers = {
		'Access-Control-Allow-Headers':
			'Content-Type, Authorization, Content-Length, X-Requested-With',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
		'Content-Type': 'application/json',
	};
	try {
		const seller = req.params.seller_id;
		const thisShop = await Seller.findOne({ _id: seller }).select({
			chat: 0,
			product: 0,
			order: 0,
			activity: 0,
			discount: 0,
			member: 0,
			introduce: 0,
			plan: 0,
			salesType: 0,
		});
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: 'success',
				thisShop,
			})
		);
		res.end();
	} catch (err) {
		res.writeHead(500, headers);
		res.end(
			JSON.stringify({
				status: 'error',
				message: 'Internal Server Error',
			})
		);
	}
});
router.put('/:seller_id/information', async (req, res, next) => {
	const headers = {
		'Access-Control-Allow-Headers':
			'Content-Type, Authorization, Content-Length, X-Requested-With',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE ,PUT',
		'Content-Type': 'application/json',
	};

	try {


		const updateData = {
			bossName: req.body.bossName,
			gender: req.body.gender,
			brand: req.body.brand,
			phone: req.body.phone,
			address: req.body.address,
			password: req.body.password,
			otherPassword: req.body.otherPassword,
			collection: req.body.collection,
			salesType: req.body.salesType,
			introduce: req.body.introduce,
		};
		const sellerId = req.params.seller_id;

		const updatedUser = await Seller.findByIdAndUpdate(sellerId, { $set: updateData }, { new: true });


		// Send success response
		res.status(200).json({
			status: 'success',
			message: '成功修改資料',
		});

		res.end();
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: 'error', message: 'Internal Server Error' });
	}
});

//訂單管理
router.get('/:seller_id/orders', async (req, res, next) => {
	const headers = {
		'Access-Control-Allow-Headers':
			'Content-Type, Authorization, Content-Length, X-Requested-With',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
		'Content-Type': 'application/json',
	};
	try {
		const seller = req.params.seller_id;
		const thisShop = await Seller.find({ _id: seller })
			.populate('order')
			.select({ order: 1, _id: 0 });
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: 'success',
				thisShop,
			})
		);
		res.end();
	} catch (err) {
		res.writeHead(500, headers);
		res.end(
			JSON.stringify({
				status: 'error',
				message: 'Internal Server Error',
			})
		);
	}
});

//商品資訊
router.get(
	'/:seller_id/products/all',
	isAuth,
	shopControllers.products.getProductsAll
);
router.get(
	'/:seller_id/products',
	isAuth,
	shopControllers.products.getProducts
);
router.get(
	'/:seller_id/product/:product_id',
	isAuth,
	shopControllers.products.getProduct
);
router.post('/product', isAuth, shopControllers.products.createProduct);
router.put(
	'/product/:product_id',
	isAuth,
	shopControllers.products.updateProduct
);
router.delete(
	'/:seller_id/product/:product_id',
	isAuth,
	shopControllers.products.deleteProduct
);

//折價券資訊
router.get('/:seller_id/coupons', isAuth, shopControllers.coupons.getCoupons);
router.get(
	'/:seller_id/coupon/:coupon_id',
	isAuth,
	shopControllers.coupons.getCoupon
);
router.post('/coupon', isAuth, shopControllers.coupons.createCoupon);
// router.put('/coupon/:coupon_id', isAuth, shopControllers.);
// router.delete(
// 	'/:seller_id/coupon/:coupon_id',
// 	isAuth,
// 	shopControllers.
// );

module.exports = router;
