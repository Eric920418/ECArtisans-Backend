var express = require('express');
var router = express.Router();
const shopControllers = require('../controllers/shopControllers.js');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Seller = require('../models/seller.js');
const Order = require('../models/order.js');

const handleErrorAsync = require('../service/handleErrorAsync.js');

const bcrypt = require('bcrypt'); //加密套件

//驗證token
const isAuth = handleErrorAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(appError(401, '你尚未登入!', next));
	}

	//驗證 token 正確性
	const decoded = await new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
			if (err) {
				reject(err);
			} else {
				resolve(payload);
			}
		});
	});
	const currentSeller = await Seller.findById(decoded.id);
	req.user = currentSeller;
	next();
});

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
		let {
			bossName,
			phone,
			brand,
			address,
			collection,
			salesType,
			introduce,
      password
		} = req.body;
		const sellerId = req.params.seller_id;

    password = await bcrypt.hash(req.body.password, 12);
		// Check if seller exists
		const seller = await Seller.findById(sellerId);
		if (!seller) {
			return res
				.status(404)
				.json({ status: 'error', message: 'Seller not found' });
		}

		// Update seller information
		await Seller.updateOne(
			{ _id: sellerId },
			{ bossName, phone, brand, address, collection, salesType, introduce ,password}
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
router.get('/:seller_id/products/all', isAuth, shopControllers.getProductsAll);
router.post('/product', isAuth, shopControllers.productPost);

module.exports = router;
