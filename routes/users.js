let express = require('express');
let router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.js');
const Coupon = require('../models/coupon.js');
const Product = require('../models/product.js');
const bcrypt = require('bcrypt');
const Seller = require('../models/seller.js');

//這兩行是用來隨機產一組有效的ObjectId 用來測試“找不到使用者” 這個ObjectId，不會被存入資料庫
const newuserId = new mongoose.Types.ObjectId();
console.log("fack user id:",newuserId.toString());

//這兩行是用來隨機產一組有效的ObjectId 用來測試“找不到商品” 這個ObjectId，不會被存入資料庫
const newProductId = new mongoose.Types.ObjectId();
console.log("Fake product id:", newProductId.toString());


// Get 全部買家
router.get('/', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  try {
    const users = await User.find();
    res.writeHead(200,headers);
    res.write(JSON.stringify({
        "status":"success",
        users
    }))
    res.end();
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

// Get 單一買家
router.get('/:id', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, PUT, POST, GET, OPTIONS, DELETE,PUT',
    'Content-Type': 'application/json'
  }
  try {
    const user = req.params.id;
    const data = await User.findOne({_id:user});
    res.writeHead(200,headers);
    res.write(JSON.stringify({
        "status":"success",
        "message": "成功取得資料",
        data
    }))
    res.end();
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


// PUT 編輯單一會員資料(買家)
router.put('/:id', async(req, res, next)=> {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, PUT, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
  }
  try {
    const user = req.params.id;
        const updateData = {
            name: req.body.name,
            gender: req.body.gender,
            avatar: req.body.avatar,
            birthday: req.body.birthday,
            phone: req.body.phone,
            mail: req.body.mail,
            address: req.body.address,
            password: req.body.password,
            otherPassword: req.body.otherPassword,
        };

    if(req.body.password){
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(user, { $set: updateData }, { new: true });

    res.status(200).json({
        status: "success",
        message: "成功修改資料",
        data: updatedUser
    });

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      "status":"fail",
      "message": "無法更新個人資料，請檢查所提供的資訊。"
    });
  }
});

// POST 新增指定會員的折價券
router.post('/:userId/discounts/:couponId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const couponId = req.params.couponId;
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "找不到使用者"
      });
    }

    const couponData = await Coupon.findById(couponId);
    if (!couponData) {
      return res.status(404).json({
        status: "error",
        message: "找不到折價券"
      });
    }
    // 檢查使用者是否已經有折價券
    if (userData.discount.includes(couponId)) {
      return res.status(409).json({
        status: "error",
        message: "已經擁有此折價券"
    });
    }
    userData.discount.push(couponId);
    await userData.save();
    res.json({
        status: "success",
        message: "成功新增折價券"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
  }
});
    

// GET 取得指定會員的全部折價券紀錄
router.get('/:id/discounts', async (req, res) => {
  try {
    const user = req.params.id;
    const userData = await User.findById(user).populate('discount');
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }
    res.json({
        status: "success",
        message: "成功取得資料",
        data: userData.discount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
  }
});


// GET 取得指定會員的折價券詳情
router.get('/:id/discounts/:couponId', async (req, res) => {
  try {
    const userId = req.params.id;
    const couponId = req.params.couponId;
        // 檢查 userId 是否為有效的 ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          status: "error",
          message: "無效的使用者 ID"
        });
    }
    const userData = await User.findById(userId).populate('discount');
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "找不到使用者"
      });
    }
    const couponData = userData.discount.find(coupon => coupon._id.toString() === couponId);
    if (!couponData) {
      return res.status(404).json({
        status: "error",
        message: "找不到折價券"
      });
    }
    res.json({
        status: "success",
        message: "成功取得資料",
        data: couponData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
  }
},);

// POST 會員收藏商品
router.post('/:id/collect', async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body; // 從請求的 body 中讀取 productId

    // 檢查 userId 和 productId 是否符合 ObjectId 規範
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        status: "error",
        message: "無效的使用者 ID 或商品 ID"
      });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "找不到使用者"
      });
    }
    // 檢查商品是否存在
    const productData = await Product.findById(productId);
    if (!productData) {
      return res.status(404).json({
        status: "error",
        message: "找不到商品"
      });
    }
    // 檢查使用者是否已經收藏商品
    if (userData.collect.includes(productId)) {
      return res.status(409).json({
        status: "error",
        message: "已經收藏此商品"
      });
    }
    userData.collect.push(productId);
    await userData.save();
    res.json({
        status: "success",
        message: "成功新增收藏"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
});

// GET 取得指定會員的收藏商品
router.get('/:id/collect', async (req, res) => {
  try {
    const userId = req.params.id;
    // 檢查 userId 是否為有效的 ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "無效的使用者 ID"
      });
    }
    const userData = await User.findById(userId).populate({path:'collect', select:'_id productName image sellerOwned price reviews sold format'});
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "找不到使用者"
      });
    }
    res.json({
        status: "success",
        message: "成功取得資料",
        data: userData.collect
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
  }
});

// DELETE 取消收藏商品
router.delete('/:id/collect/:productId', async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;
    // 檢查 userId 和 productId 是否符合 ObjectId 規範
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        status: "error",
        message: "無效的使用者 ID 或商品 ID"
      });
    }
    // 檢查使用者是否存在，並且使用 $pull 移除商品 ID
    const userData = await User.findByIdAndUpdate(userId, { $pull: { collect: productId } }, { new: true });
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "找不到使用者"
      });
    }
    res.json({
        status: "success",
        message: "成功取消收藏"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
});

// POST 會員收藏店家
router.post('/:id/collect-shop', async (req, res) => {
  try {
    const userId = req.params.id;
    const { sellerId } = req.body; // 從請求的 body 中讀取 sellerId

    // 檢查 userId 和 sellerId 是否符合 ObjectId 規範
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        status: "error",
        message: "無效的使用者 ID 或店家 ID"
      });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "找不到使用者"
      });
    }
    // 檢查店家是否存在
    const shopData = await Seller.findById(sellerId);
    if (!shopData) {
      return res.status(404).json({
        status: "error",
        message: "找不到店家"
      });
    }
    // 檢查使用者是否已經收藏店家
    if (userData.likeShop.includes(sellerId)) {
      return res.status(409).json({
        status: "error",
        message: "已經收藏此店家"
      });
    }
    userData.likeShop.push(sellerId);
    await userData.save();
    res.json({
        status: "success",
        message: "成功新增收藏"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
});

// GET 取得指定會員的收藏店家
router.get('/:id/collect-shop', async (req, res) => {
  try {
    const userId = req.params.id;
    // 檢查 userId 是否為有效的 ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "使用者 ID 輸入錯誤"
      });
    }
    const userData = await User.findById(userId).populate({path:'likeShop', select:'_id brand avatar'});
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "找不到使用者"
      });
    }
    res.json({
        status: "success",
        message: "成功取得資料",
        data: userData.likeShop
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
  }
});

// DELETE 取消收藏店家
router.delete('/:id/collect-shop/:sellerId', async (req, res) => {
  try {
    const userId = req.params.id;
    const sellerId = req.params.sellerId;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({
        status: "error",
        message: "使用者 ID 或店家 ID 輸入錯誤"
      });
    }

    const sellerData = await Seller.findById(sellerId);
    if(!sellerData){
      return res.status(404).json({
        status: "error",
        message: "找不到店家"
      })
    }

    // 檢查使用者是否存在，並且使用 $pull 移除店家 ID
    const userData = await User.findByIdAndUpdate(userId, { $pull: { likeShop: sellerId } }, { new: true });
    if (!userData) {
      return res.status(404).json({
        status: "error",
        message: "找不到使用者"
      });
    }
    res.json({
        status: "success",
        message: "成功取消收藏"
    });
  } catch (err) {
    console.error(err);
  res.status(500).json({
    status: "error",
    message: err.message
  });
  }
});
module.exports = router;
