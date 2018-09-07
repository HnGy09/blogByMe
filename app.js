/**
 * Created by Gaoyang on 2018/8/28.
 */

"use strict";

const express = require('express');
const web_router = require('./web_router');
let exphbs  = require('express-handlebars');
let app = express();
const bodyParser = require('body-parser');
let config = require('./config');
const session = require('express-session');

app.engine('.hbs', exphbs({
    extname:'.hbs', //设置模板文件后缀名
    defaultLayout: 'layout',//设置默认总模板
    partialsDir: 'views/layouts/partials/'//设置部分模板目录
}));
//模板
app.set('views','./views');
app.set('view engine','.hbs');
//处理静态文件
app.use('/public', express.static('public'));
//加入session操作包
app.use(session({ //当浏览器访问回写cookie
    secret: 'blog',
    resave: false,
    saveUninitialized: true //  cookie: { secure: true } secure为true 代表增加安全性考虑，基于https CA安全机构证书
}));
//解析body
app.use(bodyParser.urlencoded({extended:false}));//通过querystring库来解析body
//挂在本地属性
app.use((req, res, next) => {
    req.app.locals.config = config;
    next()
})
//处理路由
app.use(web_router);
//错误处理
app.use((err, req, res, next) => {
    console.log('出异常了',err.stack);
    next();
})

app.listen(config.port, () => {
    console.log('服务器启动在8888端口');
})


