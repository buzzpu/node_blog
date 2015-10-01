var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var routes = require('./routes/index');
var users = require('./routes/users');
var settings = require('./settings');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var app = express();  //建立一個express的實例
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());  //載入暫存軟體 頁面通知功能
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));  //載入log（日誌）軟體
app.use(bodyParser.json()); //載入json解析軟體
app.use(bodyParser.urlencoded({ extended: false })); //載入URL編碼解析軟體
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //設定plblic 資料夾存放靜態資料


    //app.use('/', routes);
    //app.use('/users', users);



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



//var sessionStore = new MongoStore({ 
//    db: settings.db,
//    host: settings.host,
//    port: settings.port
//}, function(e) {
//
////  var cookieParser = express.cookieParser('waytoblue');
////  app.use(cookieParser);
//
//  app.use(express.session({
//      secret: settings.cookieSecret,
//      key: settings.db,//cookie name
//      cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
//      store: sessionStore
//  }));
//
//  app.listen(app.get('port'), function(){
//    console.log('Express server listening on port' + app.get('port'));
//  });
//});





app.use(cookieParser());
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  }),
  resave: true,
  saveUninitialized: true
}));

//setTimeout(function(){
//    routes(app);
//    console.log("ok");
//},5000);

routes(app);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.listen(app.get('port'), function(){
    console.log('Express server listening on port' + app.get('port'));
});

//module.exports = app; //將名為app的express實例們匯出去給大家用
