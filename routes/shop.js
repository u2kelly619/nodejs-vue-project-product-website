//把跟權限相關的設定搬到auth.js，使專案架構更接近 MVC 設計模式

//引入express
const express = require('express');
//引入shop的controller模組
const shopController = require('../controllers/shop');

//使用中介軟體express中的Router()
const router = express.Router();

//get寫在use之後，因get會進到別的頁面(?)，不會再進中介軟體
//預設發起請求後會自動結束，所以不需要next參數
//處理路由/的get請求
router.get('/', shopController.getIndex);
router.get('/cart', shopController.getCart);

//匯出模組
module.exports = router;

