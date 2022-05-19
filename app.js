// console.log("hello world");

////第一個區塊，內建模組
const path = require('path');
// const http = require('http');

////第二個區塊，第三方模組(套件)
//Express web server
const express = require('express');

const bodyParser = require('body-parser');
//匯入第三方模組 sequelize
const Sequelize = require('sequelize'); 

////第三個區塊，自建模組
// const hello = require("./hello.js");

// hello.sayHello();
// hello.sayGoodNight();

// const cowsay = require('cowsay');

// let sentences = ['哈囉', '安安', '我是牛牛'];

// sentences.forEach((sentence) => {
//     console.log(cowsay.say({
//         text : sentence,
//         e : "^^",
//         T : "U "
//     }));
// });

//回傳 HTTP 狀態碼與網頁內容
// const server = http.createServer((req, res) => {
//     if (req.url === '/') {
//         return res.end('This is home page');
//     } 
// 		if (req.url === '/login') {
//             res.writeHead(200, { 'Content-Type': 'text/html' }); //statusCode, MIME type
//             return res.end('<h1>This is login page</h1>');
//     } 
//     res.end('page not found :(');
// });

// server.listen(3000, () => {
// 	console.log('Web Server is running on port 3000');
// });

//使用 url 模組來分析 URL
// const url = require('url');

// console.log(url.parse('https://www.notion.so/e6889306d6e44a328b85a2b188f5a36a?v=d331e5cab96e497f9499181fce10bf76'));

const app = express();

//引入utils的database模組
const database = require('./utils/database');
//引入auth.js的模組
const authRoutes = require('./routes/auth');
//引入shop.js的模組
const shopRoutes = require('./routes/shop');
//引入error.js的模組
const errorRoutes = require('./routes/error');

////middleware

//設定ejs
app.set('view engine', 'ejs'); //使用ejs的view engine樣板引擎
app.set('views', 'views'); // views的預設路徑就是 views資料夾，如果沒有變動，可以省略此設定

//告知靜態資源存放路徑
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
// 	console.log('Hello!');
// 	next(); //加上next()讓電腦知道該中介軟體已結束，要進入下一個
// });

// app.use((req, res, next) => {
// 	console.log('World!');
// 	res.end();
// });

//使用bodyParser解析 request body
app.use(bodyParser.urlencoded({ extended: false }));



//使用auth.js的模組
app.use(authRoutes);
//使用shop.js的模組
app.use(shopRoutes);
//使用error.js的模組
app.use(errorRoutes);

// app.listen(3030, () => {
// 	console.log('Web Server is running on port 3030');
// });
//改寫成promise:
database
	.sync()
	.then((result) => {
		app.listen(3030, () => {
			console.log('Web Server is running on port 3030');
		});
	})
	.catch((err) => {
		console.log('create web server error: ', err);
	});