var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', async (req, res, next) => {
	try {
		const products = await Product.find()
			.populate('SellerOwned')
			.select('productName origin format category sellerCategory img');
		res.status(200).json({
			status: 'success',
			data: {
				products,
			},
		});
	} catch (err) {
		next(err); // 將錯誤傳遞給錯誤處理中間件(後續填寫)
	}
});

//單一產品頁面
router.get('/:id', async (req, res, next) => {
	try {
		const product = req.params.id;
		const thisProduct = await Product.findOne({ _id: product });
		res.status(201).jsonsend({
			status: 'success',
			data: {
				thisProduct,
			},
		});
		res.end();
	} catch (err) {
		next(err); // 將錯誤傳遞給錯誤處理中間件(後續填寫)
	}
});

module.exports = router;
