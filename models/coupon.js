const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定義買方使用狀態 Schema（已使用、未使用、已過期）
const userUsageSchema = new Schema({
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    used: {
        type: String,
        enum: ['Used', 'Unused', 'Expired'],
        default: "Unused"
    },
});

// 定義折價券 Schema
const couponSchema = new Schema({
    couponName: String,
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
          validator: function(value) {
            // 確保結束日期不早於開始日期
            return this.startDate <= value;
          },
          message: props => `End date (${props.value}) must be after start date (${this.startDate})`
        }
    },
    type: {
        type: Number,
        enum: [0, 1], // 0: 免運, 1: 折抵
        required: true
    },
    discountConditions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    discountScope: {
        type: Number,
        enum: [0, 1], // 0: 全館, 1: 指定商品
        required: true
    },
    productChoose: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }
    ],
    isEnabled: {
        type: Boolean,
        default: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sellers'
    },
    userUsage: [userUsageSchema],
});

const Coupon = mongoose.model('Coupons', couponSchema);
module.exports = Coupon;