//var express = require('express');
//var router = express.Router();

/* GET home page. */
//原始的寫法，還需在app.js設定router
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
//
//module.exports = router;

var crypto = require('crypto'),
    User = require('../models/user.js'),
    fs = require('fs');
module.exports = function( app ){
    app.get("/", function(req, res){
        res.render('index', { 
            title: '首頁1' ,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.get("/reg", function(req, res){
        res.render('reg', { 
            title: '註冊' ,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    
    
    app.post('/reg', function (req, res) {
        var name = req.body.name,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        
        //检验用户两次输入的密码是否一致
        if (password_re != password) {
            //req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/'); //返回主册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name: req.body.name,
            password: password,
            email: req.body.email
        });
        //检查用户名是否已经存在 
        User.get(newUser.name, function (err, user) {
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg'); //返回注册页
            }
            //如果不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    //req.flash('error', err);
                    return res.redirect('/reg'); //注册失败返回主册页
                }
                
                console.log("訊息 req：" + req); 
                console.log("訊息 req.session.user：" + req.session); 
                
                
                req.session.user = user; //用户信息存入 session
                req.flash('success', '注册成功!');
                res.redirect('/'); //注册成功后返回主页
                
                
                console.log("訊息 user：" + user); 
            });
        });
    });
    
    
    app.get("/login", function(req, res){
        res.render('login', { title: '登入' });
    });
    app.post("/login", function(req, res){
    });
    app.get("/post", function(req, res){
        res.render('post', { title: '發佈' });
    });
    app.post("/post", function(req, res){
    });
    app.get("/logout", function(req, res){
    });
}
