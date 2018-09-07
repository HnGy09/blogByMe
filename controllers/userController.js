/**
 * Created by Gaoyang on 2018/8/28.
 */
const user = require('../models/user');
const utils = require('utility');
const formidable = require('formidable');
const fs = require('fs-extra');
const path = require('path');
const picture = require('../models/picture');
// 显示注册页面
exports.showRegister = function (req, res, next) {
    res.render('register');
}
// 点击注册
exports.doRegister = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let vcode = req.body.vcode
    user.findUserByNameOrEmail(username, email, function (err, users) {
        if(vcode != req.session.vcode) {
            return res.render('register', {msg: '验证码错误'})
        }
        if (users.length !== 0) {
            let tmp_user = users[0];
            if (users.length >= 2) {
                return res.render('register', {msg: '用户名和邮箱都被占用'})
            }
            if (tmp_user.username === username) {
                return res.render('register', {msg: '用户名已经被占用'})
            }
            return res.render('register', {msg: '邮箱已经被已经被占用'})
        }
        
        let tem_user = new user({
            username,
            email,
            password: utils.md5(utils.md5(password)),
        })
        
        tem_user.save(function (err, users) {
            let token = utils.md5(utils.md5(username));
            let mail =  `亲爱的用户${username},您好，注册已经完成，但您的账号还未
         激活，请到指定网址激活，谢谢!
         `;
            let href = '/active?username='+username+'&token='+token;
            let msg = '请点击';
            res.render('showNotice',{msg:mail,href,info:msg});
        })
    })
}
// 验证用户是否激活
exports.activeUser = function (req, res, next) {
   let username = req.query.username;
   let newToken = req.query.token;
   if(newToken !== utils.md5(utils.md5(username))) {
       return res.render('showNotice',{msg:'非法激活,请注册',href:'/register',info:'点我注册'});
   }
   user.updateActiveFlag(username, function (err, results) {
       console.log(results);
       if(results.changedRows === 1) {
           res.render('showNotice',{msg:'恭喜您,激活成功！',href:'/',info:'点我登录'})
       } else if(results.changedRows === 0) {
           res.render('showNotice',{msg:'您已经激活成功了,请勿重复激活！',href:'/',info:'点我登录'})
       }
   })

}
// 显示登录页面
exports.showLogin = function (req, res, next) {
    res.render('login')
}
// 登录按钮
exports.doLogin = function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    user.doLoginByUsernameOrEmail(username, function (err, result) {
        if(err) next(err);
        console.log(result);
        if(result.length === 0) {
            return res.render('login',{msg: '用户名或密码错误'});
        }
        if(result[0].active_flag !== 1) {
            let token = utils.md5(utils.md5(username));
            let mail =  `亲爱的用户${username},您好，注册已经完成，但您的账号还未
         激活，请到指定网址激活，谢谢!
         `;
            let href = '/active?username='+username+'&token='+token;
            let msg = '请点击';
            return res.render('showNotice',{msg:mail,href,info:msg});
        }
        if(result[0].password !== utils.md5(utils.md5(password))) {
            return res.render('login',{msg: '用户名或密码错误'});
        }
        req.session.user = result[0];
        res.redirect('/');
    })
}
// 退出
exports.logout = function (req, res, next) {
    req.session.user = '';
    res.render('logout')
}
// 显示用户设置页面
exports.showSettings = function (req, res, next) {
    res.render('setting', {user: req.session.user})
}
// 上传图片
exports.uploadImg = function (req, res, next) {
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // console.log('fields', fields);
        // console.log('files',files.pic.path);
        let source = files.pic.path;
        let extname =  path.extname(files.pic.name);
        let filename = (+new Date()) + extname;
        let dist = path.join(req.app.locals.config.rootDir, 'public/uploadImg', filename);
        fs.move(source, dist, function (err) {
            if(err) next(err);
            res.json({msg: '/public/uploadImg/' + filename})
        });
    });
}
// 用户设置
exports.doSettings = function (req, res, next) {
    let sex = req.body.sex;
    let username = req.body.username;
    let province = req.body.province;
    let city = req.body.city;
    let signature = req.body.signature;
    let trueName = req.body.trueName;
    let pic = req.body.filePath;
    user.updateInfoByUsername(username,province,city,signature,trueName,sex,pic,function (err, data) {
        if(err) next(err);
        user.findUserByName(username, function (err, data) {
            if(err) next(err);
            req.session.user = data[0];
            res.redirect('settings');
        })
    })
}
// 获取验证码
exports.getPic = function (req, res, next) {
    picture.getPicture('0123456789', 4, function (err, data) {
        if(err)next(err);
        req.session.vcode = data.text;
        res.send(data.buf);
    })
}









