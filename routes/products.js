var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/productModel');

router.get('/', async (req, res, next) => {
	const headers = {
		'Access-Control-Allow-Headers':
			'Content-Type, Authorization, Content-Length, X-Requested-With',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE,PUT',
		'Content-Type': 'application/json',
	};
	try {
		const products = await Product.find()
			.populate('haveStore')
			.select('productName origin format type image');
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: 'success',
				products,
			})
		);
		res.end();
	} catch (err) {
		res.status(500).send('Internal Server Error');
	}
});

//單一產品頁面
router.get('/:id', async (req, res, next) => {
	const headers = {
		'Access-Control-Allow-Headers':
			'Content-Type, Authorization, Content-Length, X-Requested-With',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
		'Content-Type': 'application/json',
	};
	try {
		const product = req.params.id;
		const thisProduct = await Product.findOne({ _id: product });
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: 'success',
				thisProduct,
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

module.exports = router;
