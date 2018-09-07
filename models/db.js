/**
 * Created by Gaoyang on 2018/8/28.
 */
const mysql = require('mysql');
const config = require('../config.js');
let pool = mysql.createPool({
    host: config.host,
    user: config.db_user,
    password: config.db_password,
    database: config.database
});
// SELECT * from blog where username = ?
exports.query = function (str, params, callback) {
    pool.getConnection(function (err, connection) {
        if (err) callback(err); // not connected!
        //打印一下sql
        console.log('sql语句：', str, params);
        //查询
        connection.query(str, params, function (err, results) {
            //提交-->事物   有的人数据库并不是自动提交
            //需要手动提交
            connection.commit();//保证每次提交
            //释放连接
            connection.release();

            if (err) callback(err, null);//出现错误
            callback(null, results);//没有错误,不一定有数据
        });
    });
}
