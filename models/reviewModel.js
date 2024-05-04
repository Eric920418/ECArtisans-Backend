const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
	{
		UserID: {
			name: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		rate: {
			type: Number,
			require: [true, '請選擇評價'],
		},
		comment: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Review = mongoose.model('Product', reviewSchema);

module.exports = Review;
