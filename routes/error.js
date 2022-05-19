//把跟錯誤處理相關的設定搬到error.js，使專案架構更接近 MVC 設計模式

//引入express
const express = require('express');
//使用中介軟體express中的Router()
const router = express.Router();

//萬用路由*，要放在所有路由設定之後
//把app.get改為router.get
router.get('*', (req, res) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); //把node資料夾>views>404.html的檔案拿來顯示
    res.status(404).render('404.ejs',{
        pageTitle: 'This is 404 page.',
        path: '*'
    });
});

//匯出模組
module.exports = router;