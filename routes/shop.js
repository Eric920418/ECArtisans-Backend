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
		let { bossName, phone, brand, address, collection, salesType, introduce } =
			req.body;
		const sellerId = req.params.seller_id;

		const seller = await Seller.findById(sellerId);
		if (!seller) {
			return res
				.status(404)
				.json({ status: 'error', message: 'Seller not found' });
		}
		// Update seller information
		await Seller.updateOne(
			{ _id: sellerId },
			{ bossName, phone, brand, address, collection, salesType, introduce }
		);

		// Send success response
		res.status(200).json({
			status: 'success',
			message: 'Seller information updated successfully',
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: 'error', message: 'Internal Server Error' });
	}
});

router.patch('/:seller_id/password', async (req, res, next) => {
	const headers = {
		'Access-Control-Allow-Headers':
			'Content-Type, Authorization, Content-Length, X-Requested-With',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE ,PUT',
		'Content-Type': 'application/json',
	};

	try {
		let { password } = req.body;
		const sellerId = req.params.seller_id;
		const sellerPassword = await Seller.findById(sellerId).select('password');
		if (!sellerPassword) {
			return res
				.status(404)
				.json({ status: 'error', message: 'Seller not found' });
		}
		if (!password) {
			return res
				.status(400)
				.json({ status: 'error', message: 'Password is required' });
		}
		password = await bcrypt.hash(password, 12);

		await Seller.updateOne({ _id: sellerId }, { password });
		res.status(200).json({
			status: 'success',
			message: 'Seller password updated successfully',
		});
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
