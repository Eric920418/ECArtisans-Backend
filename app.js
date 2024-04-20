var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var activitiesRouter = require('./routes/activities')
var authRouter = require('./routes/auth')
var cartsRouter = require('./routes/carts')
var detailRouter = require('./routes/detail')
var discountsRouter = require('./routes/discounts')
var homeRouter = require('./routes/home')
var ordersRouter = require('./routes/orders')
var productsRouter = require('./routes/products')
var searchRouter = require('./routes/search')
var sellersRouter = require('./routes/sellers')
var shopRouter = require('./routes/shop')

// mongodb
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);  //預設(目前無用)
//data
app.use('/users', usersRouter);
app.use('/sellers', sellersRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use('/activities', activitiesRouter)
app.use('/discounts', discountsRouter)
app.use('/carts', cartsRouter)
//view
app.use('/home', homeRouter)
app.use('/shop', shopRouter)
app.use('/detail', detailRouter)
//Function
app.use('/auth', authRouter)
app.use('/search',searchRouter)

mongoose.connect(process.env.DATABASE)    
.then(()=>{
    console.log('資料庫連線成功')
})
.catch((error)=>{
    console.log(error);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const resErrorProd = (err,res) =>{
  if(err.isOperational){
    res.status(err.statusCode).json({
      message:err.message
    })
  }else{
    console.error("出現重大錯誤",err)
    res.status(500).json({
      status: 'error',
      message: '系統錯誤～～'
    })
  }
}
const resErrorDev = (err,res) =>{
  res.status(err.statusCode).json({
    message:err.message,
    error:err,
    stack:err.stack
  })
}

// error handler
app.use(function(err, req, res, next) {
  err.statusCode = err.statusCode || 500
  if(process.env.NODE_ENV === 'dev'){
    return resErrorDev(err,res)
  }
  if(err.name === 'ValidationError'){
    err.messages = "資料不正確 請重新輸入"
    err.isOperational = true
    return resErrorProd(err,res)
  }
  resErrorProd(err,res)
});

module.exports = app;
