//引入sequelize
const Sequelize = require('sequelize');
//引入database模組
const database = require('../utils/database');

//定義資料結構
const Product = database.define('product', {
    id: { 
        type: Sequelize.INTEGER, // 資料的型別
        autoIncrement: true, // 資料是否會自動增加（一般用於 id）
        allowNull: false, // 是否接受 null 值
        primaryKey: true, // 是否為 Primary Key
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    img: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
});

//匯出資料模組
module.exports = Product;