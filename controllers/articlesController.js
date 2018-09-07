/**
 * Created by Gaoyang on 2018/8/28.
 */
let Article = require('../models/articles');
let Pager = require('../models/pager');
let User = require('../models/user');
let Comment = require('../models/comments');
let md = require('markdown-it')();
const timeAgo = require('time-ago');
const util = require('utility');
exports.showIndex = (req, res, next) => {
    Article.articlesTotalCount(function (err, data) {
        if (err) next(err);
        let sum = data[0].count;
        let viewCount = req.app.locals.config.viewCount;
        let currentPage =  1;
        let totalPages = Math.ceil(sum / viewCount);
        let pager = new Pager({
            currentPage,viewCount,totalPages
        })
        Article.articlesCurrentPageContents(currentPage, viewCount, function (err, articles) {
            if (err) next(err);
            // console.log('articles-------------', articles);
            res.render('index', {user: req.session.user, pager, articles});
        })
    })
    // req.query.currentPage ||
}
// exports.getCurrentPageArticles = function (req, res, next) {
//
//
//     articles.articlesTotalCount(function (err, data) {
//         if (err) next(err);
//         let sum = data[0].count;
//         let viewCount = req.app.locals.config.viewCount;
//         let currentPage = req.query.currentPage || 1;
//         let totalPages = Math.ceil(sum / viewCount);
//         let pager = new Pager({
//             currentPage,viewCount,totalPages
//         })
//         let offset = (currentPage - 1) * 5;
//         articles.articlesCurrentPageContents(offset, viewCount, function (err, articles) {
//             if (err) next(err);
//             res.render('index', {user: req.session.user, pager, articles});
//         })
//     })
// }

exports.getCurrentPageArticles = function (req, res, next) {
    let q = req.body.q;
    if(q || q === '') {
        req.app.locals.q = q;
    } else {

        if(req.app.locals.q){
            q = req.app.locals.q;
        } else {
            q = '';
        }
    }
    Article.getTotalCountByCondition(q, function (err, data) {
        if(err)next(err);
        if(!data){
            return res.redirect('/');
        }
        let sum = data[0].total;
        let viewCount = req.app.locals.config.viewCount;
        let currentPage =  req.query.currentPage || 1;
        let totalPages = Math.ceil(sum / viewCount);
        let offset = (currentPage -1 ) *  viewCount;
        let pager = new Pager({
            viewCount, currentPage, totalPages
        })
        Article.getArticlesByConditionList(q, offset, viewCount, function (err, articles) {
            if(err) next(err);
            console.log('articles=======', articles);
            articles.forEach(function(art){
                art.time = timeAgo.ago(art.time);
            });
            res.render('index', {user: req.session.user, pager, articles, inputValue: q})
        })
    })
}


//显示发布页面
exports.showPublishArticlePage = function (req, res, next) {
    res.render('publish', {user: req.session.user})
}
//发布文章
exports.publishArticle = function (req, res, next) {
    let title = req.body.title;
    let content = req.body.content;
    if(typeof title != 'undefined') title = title.trim();
    if(typeof content != 'undefined'){
        content = content.trim();
        content = md.render(content);
    }
    let uid = req.session.user.id;

    let article = new Article({
        title, content, uid
    })
    article.save(function (err, data) {
        if(err) next(err);
        // console.log(data);
        res.redirect('/showArticle?aid='+data.insertId)
    })
}

exports.showArticle = function (req, res, next) {
    let aid = req.query.aid;
    console.log('aid', aid);
    Article.findArticleByAid(aid, function (err, data) {
        if(err) next(err);
        let article = data[0];
        // console.log(data);
        // console.log('article.uid', article.uid);
        article.time = timeAgo.ago(article.time);
        User.findUserById(article.uid, function (err, user) {
            if(err) next(err);
            let anthor = user[0];
            // console.log('anthor', anthor);
            Comment.findCommentsByAid(aid, function (err, comments) {
                if (err)next(err);
                // console.log('comments', comments);
                comments.forEach(function (comment) {
                    comment.time = timeAgo.ago(comment.time);
                })
                let token = util.md5(''+ (+new Date()));

                req.session.token = token;

                res.render('article', {user: req.session.user,comments,article,anthor, token})
            })

        });

    })
}