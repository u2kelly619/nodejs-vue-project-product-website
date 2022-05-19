//變成一個function
const getLogin = (req, res) => {
    // res.status(200).sendFile(path.join(__dirname, 'views', 'login.html')); //把node資料夾>views>login.html的檔案拿來顯示
    res.status(200).render('auth/login',{
        pageTitle: 'This is login page.',
        path: '/login'
    });
}

const postLogin = (req, res) => {
    const { email, password } = req.body; //ES6解構賦值
    if (email && password) { //如果有填寫信箱密碼就導至首頁
        res.redirect('/');
    } else { //沒填寫完全則console.log提示訊息
		console.log('欄位尚未填寫完成！')
    }
}

const postLogout = (req, res) => {
    //TODO: 實作logout機制
    res.redirect('/login');
}

//建議用物件寫法
module.exports = {
    getLogin, //getLogin: getLogin
    postLogin,
    postLogout,
}