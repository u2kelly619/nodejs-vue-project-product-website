//把跟錯誤處理相關的設定搬到error.js，使專案架構更接近 MVC 設計模式

//引入express
const express = require('express');
//引入error的controller模組
const errorController = require('../controllers/error');

//使用中介軟體express中的Router()
const router = express.Router();

//萬用路由*，要放在所有路由設定之後
//把app.get改為router.get
router.get('*', errorController.getAll);

//匯出模組
module.exports = router;