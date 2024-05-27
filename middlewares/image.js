const multer = require('multer');
const path = require('path');
const upload = multer({
	limits: {
		fileSize: 3 * 1024 * 1024, //3mb
	},
	fileFilter(req, file, callback) {
		const ext = path.extname(file.originalname).toLowerCase();
		if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
			return callback(
				new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。')
			);
		}
		callback(null, true);
	},
}).any();

module.exports = upload;
