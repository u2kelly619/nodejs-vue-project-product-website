//把跟權限相關的設定搬到auth.js，使專案架構更接近 MVC 設計模式

//引入express
const express = require('express');
//使用中介軟體express中的Router()
const router = express.Router();

//從app.get改成router.get
router.get('/login', (req, res) => {
    // res.status(200).sendFile(path.join(__dirname, 'views', 'login.html')); //把node資料夾>views>login.html的檔案拿來顯示
    res.status(200).render('login.ejs',{
        pageTitle: 'This is login page.',
        path: '/login'
    });
});

//處理post請求
router.post('/login', (req, res) => {
    const { email, password } = req.body; //ES6解構賦值
    if (email && password) { //如果有填寫信箱密碼就導至首頁
        res.redirect('/');
    } else { //沒填寫完全則console.log提示訊息
		console.log('欄位尚未填寫完成！')
    }
});

router.post('/logout', (req, res) => {
    //TODO: 實作logout機制
    res.redirect('/login');
});

//匯出模組
module.exports = router;
