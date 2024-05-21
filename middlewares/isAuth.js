const jwt = require('jsonwebtoken');
const Seller = require('../models/seller.js');
const handleErrorAsync = require('../service/handleErrorAsync.js');
const appError = require('../service/appError.js');

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

	// 驗證token的正確性
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
	if (!currentSeller) {
		return next(appError(401, '用戶不存在', next));
	}
	req.user = currentSeller;
	next();
});

module.exports = isAuth;
