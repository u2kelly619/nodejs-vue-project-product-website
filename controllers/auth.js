//匯入user模組
const User = require('../models/user');

//變成一個function
const getLogin = (req, res) => {
    // res.status(200).sendFile(path.join(__dirname, 'views', 'login.html')); //把node資料夾>views>login.html的檔案拿來顯示
    res.status(200).render('auth/login',{ //render會去views資料夾抓
        pageTitle: 'This is login page.',
        path: '/login'
    });
}

const postLogin = (req, res) => {
    const { email, password } = req.body; //ES6解構賦值，req.body為物件資料
    //findOne({條件}):回傳物件
    User.findOne({ where: { email }}) //email:email
        .then((user) => { //findOne()回傳的物件為user
            //如果使用者不存在
			if (!user) {
                console.log('login: 找不到此 user 或密碼錯誤');
                return res.redirect('/login');
            }
			//比對密碼，資料庫內存的密碼(user.password)是否等於使用者輸入的密碼(req.body的password)
            if (user.password === password) {
                console.log('login: 成功');
                req.session.isLogin = true;
                return res.redirect('/')
            } 
            console.log('login: 找不到此 user 或密碼錯誤');
            //找不到使用者和密碼錯誤都用同個錯誤訊息，為了防止駭客
            res.redirect('/login');
        })
        .catch((err) => {
            console.log('login error:', err);
        });
}

const postLogout = (req, res) => {
    req.session.isLogin = false;
    res.redirect('/login');
}

//建議用物件寫法
module.exports = {
    getLogin, //getLogin: getLogin
    postLogin,
    postLogout,
}