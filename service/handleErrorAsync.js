const handleErrorAsync = function handleErrorAsync(func) {
	return function (req, res, next) {
		func(req, res, next).catch(function (error) {
			return error;
		});
	};
};

module.exports = handleErrorAsync;
