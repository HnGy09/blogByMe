/**
 * Created by Gaoyang on 2018/9/3.
 */
const Comment = require('../models/comments')
exports.saveComment = function (req, res, next) {
    if (!req.session.user) {
        return res.render('showNotice', {msg: '请登录后再来评论', info: '点击登录', href: '/login'})
    }
    let content = req.body.content;
    let aid = req.params.aid;
    let uid = req.session.user.id;

    let comment = new Comment({
        content, uid, aid
    })

    let pageToken = req.body.token;
    let saveToken = req.session.token;
    if (!checkToken(pageToken, saveToken)) {
        return res.render('showNotice', {msg: '请勿重复提交，请升级带宽', info: '点击到主页', href: '/'})
    }

    req.session.token = null;
    req.session.save();

    comment.save(function (err, result) {
        if (err) next(err);
        console.log(result);
        return res.redirect('/showArticle?aid=' + aid);
    })
}

function checkToken(t1, t2) {
    if (t1 === null) {
        return false;
    }
    if (t2 === null) {
        return false;
    }
    if (t1 !== t2) {
        return false;
    }
    return true;
}