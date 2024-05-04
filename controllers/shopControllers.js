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
	async productPost(req, res) {
		try {
			const sellerOwned = req.user._id;
			console.log(sellerOwned);

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
				img,
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
					img,
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
};

module.exports = products;
