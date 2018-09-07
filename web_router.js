/**
 * Created by Gaoyang on 2018/8/28.
 */
const express = require('express');
let articlesController = require('./controllers/articlesController');
let userController = require('./controllers/userController');
let commentController = require('./controllers/commentController');
let web_router = express.Router();

web_router.get('/', articlesController.showIndex)//显示首页
    .get('/register', userController.showRegister)//显示注册页
    .post('/doRegister', userController.doRegister)//完成注册
    .get('/active', userController.activeUser)//激活检验
    .get('/login', userController.showLogin)//显示登录页面
    .post('/doLogin', userController.doLogin)//登录操作
    .get('/logout', userController.logout)//退出
    .get('/settings', userController.showSettings)//显示设置页面
    .post('/settingsUpload', userController.uploadImg )//上传图片
    .post('/doSettings', userController.doSettings )//保存设置
    .get('/getArticles', articlesController.getCurrentPageArticles )//分页查询
    .post('/getArticlesByCondition', articlesController.getCurrentPageArticles )//分页条件查询
    .get('/getPicture', userController.getPic )//验证码 获取图片
    .get('/publishArticle', articlesController.showPublishArticlePage )//显示发布文章页面
    .post('/picUpload', userController.uploadImg )//发布文章里面的上传图片
    .post('/publish/article', articlesController.publishArticle )//发布文章
    .get('/showArticle', articlesController.showArticle )//发布文章
    .post('/comment/post/:aid', commentController.saveComment) //提交评论
module.exports = web_router;

