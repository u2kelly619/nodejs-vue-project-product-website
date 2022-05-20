//匯入user模組
const User = require('../models/user');

//變成一個function
const getLogin = (req, res) => {
    const errorMessage = req.flash('errorMessage')[0];
    // res.status(200).sendFile(path.join(__dirname, 'views', 'login.html')); //把node資料夾>views>login.html的檔案拿來顯示
    res.status(200).render('auth/login',{ //render會去views資料夾抓
        pageTitle: 'Login',
        // path: '/login' //全域已有定義(app.js內處理login狀態時有設定 res.locals.path = req.url)，但這邊再寫一次的話權重更高，會覆寫
        errorMessage //render時將errorMessage傳進login視圖
    });
}

const getSignup = (req, res) => {
    const errorMessage = req.flash('errorMessage')[0];
    res.status(200)
        .render('auth/signup', {
            pageTitle: 'Signup',
            errorMessage
        });
}

const postLogin = (req, res) => {
    const { email, password } = req.body; //ES6解構賦值，req.body為物件資料
    //findOne({條件}):回傳物件
    User.findOne({ where: { email }}) //email:email
        .then((user) => { //findOne()回傳的物件為user
            //如果使用者不存在
			if (!user) {
                req.flash('errorMessage', '錯誤的 Email 或 Password。');
                // console.log('login: 找不到此 user 或密碼錯誤');
                return res.redirect('/login');
            }
			//比對密碼，資料庫內存的密碼(user.password)是否等於使用者輸入的密碼(req.body的password)
            if (user.password === password) {
                console.log('login: 成功');
                req.session.isLogin = true;
                return res.redirect('/')
            } 
            req.flash('errorMessage', '錯誤的 Email 或 Password。');
            // console.log('login: 找不到此 user 或密碼錯誤');
            //找不到使用者和密碼錯誤都用同個錯誤訊息，為了防止駭客
            res.redirect('/login');
        })
        .catch((err) => {
            console.log('login error:', err);
        });
}

const postSignup = (req, res) => {
    const { displayName, email, password } = req.body;
    User.findOne({ where: { email } }) //email: email
        .then((user) => {
            if (user) {
                req.flash('errorMessage', '此帳號已存在！請使用其他 Email。')
                return res.redirect('/signup');
            } else {
                //寫入資料庫
                return User.create({ displayName, email, password });
            }
        })
        .then((result) => {
            res.redirect('/login');
        })
        .catch((err) => {
            console.log('signup_error', err);
        });
}

const postLogout = (req, res) => {
    //destroy()清除session，要傳入一個callback function
    req.session.destroy((err) => {
        console.log('session destroy() error: ', err);
		//處理完後導回login頁
        res.redirect('/login');
    });
}

//建議用物件寫法
module.exports = {
    getLogin, //getLogin: getLogin
    getSignup,
    postLogin,
    postSignup,
    postLogout,
}