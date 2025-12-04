var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// --- 1. IMPORT THƯ VIỆN SWAGGER ---
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
// ----------------------------------

const mongoose = require('mongoose');
require("./models/product");
require("./models/Category");
require("./models/review");
require("./models/image");
require("./models/cart");
require("./models/order");
require("./models/orderDetail");
require("./models/user");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/categoryRouter');
var productRouter = require('./routes/productRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect database
mongoose.connect('mongodb+srv://hirazi:123@cluster1.1qww5ct.mongodb.net/MD20301')
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

// --- 2. CẤU HÌNH SWAGGER UI ---
// Phải đặt đoạn này TRƯỚC khi bắt lỗi 404
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger UI ready at http://localhost:3000/api-docs");
} catch (error) {
  console.log("Lỗi không thể load Swagger: " + error.message);
}
// -----------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;