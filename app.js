// console.log("hello world");

//------第一個區塊，內建模組------
const path = require('path');
// const http = require('http');

//------第二個區塊，第三方模組(套件)------
//Express web server
const express = require('express');
//解析post回來的資料(request body)
const bodyParser = require('body-parser');
//匯入sequelize
const Sequelize = require('sequelize'); 
//處理session的express-session套件
const session = require('express-session');
//connect-flash套件，錯誤訊息跳頁再回來後會消失
const connectFlash = require('connect-flash');
//csrf保護機制套件
const csrfProtection = require('csurf');

//------第三個區塊，自建模組------
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
const port = 3000; //web server運行的port，方便維護
const oneDay = 1000*60*60*24; //for session儲存時間

//引入utils的database模組
const database = require('./utils/database');
//引入auth.js的模組
const authRoutes = require('./routes/auth');
//引入shop.js的模組
const shopRoutes = require('./routes/shop');
//引入error.js的模組
const errorRoutes = require('./routes/error');
//引入models的Product模組
const Product = require('./models/product');
//引入models的User模組
const User = require('./models/user');

//------middleware (由上而下執行)------

//設定ejs
app.set('view engine', 'ejs'); //使用ejs的view engine樣板引擎
app.set('views', 'views'); // views的預設路徑就是views資料夾，如果沒有變動，可以省略此設定

//告知靜態資源存放路徑
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
// 	console.log('Hello!');
// 	next(); //自定義的函式要加上next()讓電腦知道該中介軟體已結束，要進入下一個
// });

// app.use((req, res, next) => {
// 	console.log('World!');
// 	res.end();
// });

//使用bodyParser解析post回來的資料(request body)
app.use(bodyParser.urlencoded({ extended: false }));
//使用connect-flash模組
app.use(connectFlash());
//使用csrf模組
app.use(csrfProtection());

//使用express-session中介軟體的函式
app.use(session({ 
	secret: 'sessionToken',  // 加密用的字串
	resave: false,   // 沒變更內容是否強制回存
	saveUninitialized: false ,  // 新 session 未變更內容是否儲存
	cookie: {
		maxAge: 10000 // session 狀態儲存多久？單位為毫秒
	}
})); 
app.use((req, res, next) => {
    //res.locals, session都是express-session設定的全域變數，每個模板都可以使用
    //把path存到全域變數，後續可以直接使用，render時不用再傳入path參數
    res.locals.path = req.url;
    //把isLogin存在全域變數，登入狀態(布林值)
    res.locals.isLogin = req.session.isLogin || false;
    //把csrfToken存在全域變數
    res.locals.csrfToken = req.csrfToken();
    next();
});

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
    //因為要測試資料，先清空reset再開始執行，之後可以拿掉
	// .sync({ force: true })
    .sync()
	.then((result) => {
        // User.create({ displayName: 'Admin', email: 'admin@skoob.com', password: '11111111'})
        //bulkCreate(array):輸入多筆資料的方法 
        // Product.bulkCreate(products);
		app.listen(port, () => {
			console.log(`Web Server is running on port ${port}`);
		});
	})
	.catch((err) => {
		console.log('create web server error: ', err);
	});


const products = [
    // {
    //     title: '四月是你的謊言 1',
    //     price: 80,
    //     description: '有馬公生的母親一心想把有馬培育成舉世聞名的鋼琴家，而有馬也不負母親的期望，在唸小學時就贏得許多鋼琴比賽的大獎。11歲的秋天，有馬的母親過世，從此他再也聽不見自己彈奏的鋼琴聲，沮喪的他也只好放棄演奏，但在14歲那年，經由兒時玩伴的介紹，有馬認識了小提琴手宮園薰，並被薰的自由奔放吸引，沒想到薰竟開口邀請公生在比賽時擔任她的伴奏…',
    //     imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/25/0010622563.jpg&v=52dcfd21&w=348&h=348'
    // },
    // {
    //     title: '四月是你的謊言 2',
    //     price: 80,
    //     description: '公生答應在二次預賽中擔任小薰的鋼琴伴奏。比賽一開始公生還能順利彈琴，但在中途又再次因為聽不見鋼琴的聲音而停手。沒想到小薰也跟著停止演奏、等候公生。原本心灰意冷的公生因此重新振作，與小薰合奏出驚人的樂章…......',
    //     imageUrl: 'https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/31/0010623172.jpg&v=52dcfd21&w=348&h=348'
    // },
    // {
    //     title: '四月是你的謊言 3',
    //     price: 80,
    //     description: '在小薰的逼迫之下，公生不得不參加音樂比賽。為了參加比賽，公生從早到晚不停的練習，但就是無法彈奏出屬於自己的巴哈與蕭邦。此時，公生的面前出現兩位強勁的對手-相座武士與井川繪見，他們曾經是公生的手下敗將，一心想在比賽中擊敗公生雪恥。先上台演奏的武士彈奏出令全場喝采的激昂樂章…',
    //     imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/76/0010627615.jpg&v=5315ab5f&w=348&h=348'
    // },
];