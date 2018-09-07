/**
 * Created by Gaoyang on 2018/8/30.
 */
let db = require('./db');
function Article(article) {
    this.title = article.title;
    this.content = article.content;
    this.time = article.time;
    this.uid = article.uid;
    this.answerCount = article.answerCount;
}
Article.articlesTotalCount = function (callback) {
    db.query('select count(*) as count from articles', [], callback)
}

Article.articlesCurrentPageContents = function (offset, count, callback) {
    db.query(`select t1.id aid,t1.title,t1.content,t1.uid,t1.answerCount,t1.time,t2.username,t2.pic,t2.trueName from articles t1 left join users t2 on t1.uid = t2.id limit ${offset},${count}`, [] ,callback)
}

Article.getTotalCountByCondition = function (condition, callback) {
    db.query('select count(*) as total from articles where title like ?', ['%'+condition+'%'], callback)
}

Article.getArticlesByConditionList = function (condition,offset, count, callback) {
    db.query(`select t1.id aid,t1.title,t1.content,t1.uid,t1.answerCount,t1.time,
      t2.username,t2.pic,t2.trueName from articles t1 left join users t2 on t1.uid = t2.id where t1.title like '%${condition}%' limit ?,? `, [offset, count], callback)
}

Article.prototype.save = function (callback) {
    db.query('insert into articles (title, content, time, uid, answerCount) values (?,?,CURRENT_TIMEStAMP,?,0)',[this.title, this.content, this.uid], callback)
}

Article.findArticleByAid =function (aid, callback) {
    db.query('select id aid, title, content, uid, answerCount, time from articles where id = ? ',  [aid], callback)
}

module.exports = Article;