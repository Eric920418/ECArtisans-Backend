const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');
const Products = require('../models/product');
const Seller = require('../models/seller');

//商品相關
const products = {
	async getProductsAll(req, res) {
		const sellerID = req.params.seller_id;
		const allProducts = await Products.find({
			sellerOwned: sellerID,
		}).populate({
			path: 'sellerOwned',
			select: 'brand product',
		});
		handleSuccess(res, allProducts);
	},
	async getProducts(req, res) {
		try {
			const sellerID = req.params.seller_id;
			const page = parseInt(req.query.page, 10) || 1;
			const qty = parseInt(req.query.qty, 12) || 12;
			const category = req.query.category; //指定自訂分類

			let query = { sellerOwned: sellerID };
			if (category) {
				query.category = category; //附加搜尋條件
			}

			const skip = (page - 1) * qty;
			const totalProducts = await Products.countDocuments({
				sellerOwned: sellerID,
			});
			const totalPages = Math.ceil(totalProducts / qty);

			const products = await Products.find(query)
				.skip(skip)
				.limit(qty)
				.populate({
					path: 'sellerOwned',
					select: 'brand product',
				});

			const pagination = {
				totalPages: totalPages,
				currentPage: page,
				hasPrev: page > 1,
				hasNext: page < totalPages,
			};

			res.json({
				status: true,
				products: products,
				pagination: pagination,
			});
		} catch (err) {
			handleError(err);
		}
	},
	async getProduct(req, res) {
		const sellerID = req.params.seller_id;
		const productID = req.params.product_id;
		const thisProduct = await Products.find({
			_id: productID,
			sellerOwned: sellerID,
		}).populate({
			path: 'sellerOwned',
			select: 'brand product',
		});

		if (!thisProduct) {
			return res.status(404).json({
				status: false,
				message: '找不到此商品',
			});
		}

		handleSuccess(res, thisProduct);
	},
	async createProduct(req, res) {
		try {
			const sellerOwned = req.user._id;
			//console.log(sellerOwned);
			const {
				productName,
				sellerCategory,
				category,
				origin,
				ingredient,
				format,
				introduction,
				production,
				isOnShelf,
				fare,
				pay,
				keyword,
				image,
			} = req.body;

			if (req.body) {
				const newProduct = await Products.create({
					sellerOwned,
					productName,
					sellerCategory,
					category,
					origin,
					ingredient,
					format,
					introduction,
					production,
					isOnShelf,
					fare,
					pay,
					keyword,
					image,
				});
				// 更新賣家的產品列表
				await Seller.findByIdAndUpdate(sellerOwned, {
					$push: { product: newProduct._id },
				});
				handleSuccess(res, newProduct);
			} else {
				handleError(res);
			}
		} catch (err) {
			handleError(res, err);
		}
	},
	async updateProduct(req, res) {
		try {
			const productID = req.params.product_id;
			const sellerOwned = req.user._id;
			//console.log(sellerOwned);
			const {
				productName,
				sellerCategory,
				category,
				origin,
				ingredient,
				format,
				introduction,
				production,
				isOnShelf,
				fare,
				pay,
				keyword,
				image,
			} = req.body;

			if (req.body) {
				const updatedProduct = await Products.findByIdAndUpdate(productID, {
					sellerOwned,
					productName,
					sellerCategory,
					category,
					origin,
					ingredient,
					format,
					introduction,
					production,
					isOnShelf,
					fare,
					pay,
					keyword,
					image,
				});

				if (!updatedProduct) {
					return res.status(404).json({
						status: false,
						message: '找不到產品',
					});
				}

				handleSuccess(res, updatedProduct);
			} else {
				handleError(res);
			}
		} catch (err) {
			handleError(res, err);
		}
	},
	async deleteProduct(req, res) {
		const { seller_id, product_id } = req.params;
		try {
			const product = await Product.findOne({
				_id: product_id,
				sellerOwned: seller_id,
			});
			if (!product) {
				return res.status(404).json({
					status: false,
					message: '此商品沒被找到獲您無權刪除此商品',
				});
			}

			await Product.deleteOne({ _id: product_id });

			res.json({
				status: true,
				message: '此商品成功被刪除',
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({
				status: false,
				message: 'Internal Server Error',
			});
		}
	},
};

module.exports = products;
