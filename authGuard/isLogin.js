module.exports = (req, res, next) => {
    if (!req.session.isLogin) { //如果沒登入就導至login
        return res.redirect('/login');
    }
    next(); //有登入則繼續進行
}