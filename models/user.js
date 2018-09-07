/**
 * Created by Gaoyang on 2018/8/28.
 */
let db = require('./db');
function User(user) {
    this.username = user.username;
    this.password = user.password;
    this.active_flag = user.active_flag;
    this.vcode = user.vcode;
    this.email = user.email;
}

User.findUserByNameOrEmail = function (username, email, callback) {
    db.query('select * from users where username = ? or email = ?',[username,email],callback);
}

User.prototype.save = function (callback) {
    db.query('insert into users (username, password, active_flag, email, pic) values (?,?,?,?,?)',[this.username,this.password,this.active_flag,this.email,this.pic], callback)
}
User.updateActiveFlag = function (username, callback) {
    db.query('update users set active_flag = 1 where username = ?', [username], callback)
}
User.findUserByName = function (username, callback) {
    db.query('select * from users where username = ? ', [username], callback)
}
User.doLoginByUsernameOrEmail = function (username, callback) {
    db.query('select * from users where username = ?', [username], callback)
}

User.updateInfoByUsername = function (username,province,city,signature,trueName,sex,pic,callback) {
    db.query(`update users set province =? ,city = ? ,signature =? , trueName = ? ,sex =? ,pic = ? 
    where username = ?`, [province,city,signature,trueName,sex,pic,username],callback)
}

User.findUserById = function (id, callback) {
    db.query('select * from users where id=? ', [id], callback)
}
module.exports = User;