/**
 * Created by Gaoyang on 2018/8/31.
 */
"use strict";
let db = require('./db');

function Comment(comment) {
    this.id = comment.id;
    this.content = comment.content;
    this.time = comment.time;
    this.uid = comment.uid;
    this.aid = comment.aid;
}

// exports.findCommentsByAid = function (aid, callback) {
//     db.query('select * from comments t1 left join articles t2 on t1.uid = t2.id where t1.aid = ?', [aid], callback)
// }

Comment.findCommentsByAid = function(aid,callback){
    db.query(`
    select t1.id cid,t1.content,t1.time,t1.uid,t1.aid,t2.username,t2.pic,t2.trueName from comments t1
    left join users t2 on t1.uid = t2.id
     where t1.aid = ?
  `,[aid],callback);
}

Comment.prototype.save = function (callback) {
    db.query('insert into comments (content,time,uid,aid) values (?,CURRENT_TIMEStAMP,?,?)', [this.content, this.uid, this.aid], callback)
}
module.exports = Comment;