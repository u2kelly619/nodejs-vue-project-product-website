// console.log("hello world");

//第一個區塊，內建模組
const path = require('path');
// const http = require('http');

//第二個區塊，第三方模組(套件)

//第三個區塊，自建模組
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

//Express web server
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

//middleware

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

const products = [
    {
        title: '四月是你的謊言 1',
        price: 80,
        description: '有馬公生的母親一心想把有馬培育成舉世聞名的鋼琴家，而有馬也不負母親的期望，在唸小學時就贏得許多鋼琴比賽的大獎。11歲的秋天，有馬的母親過世，從此他再也聽不見自己彈奏的鋼琴聲，沮喪的他也只好放棄演奏，但在14歲那年，經由兒時玩伴的介紹，有馬認識了小提琴手宮園薰，並被薰的自由奔放吸引，沒想到薰竟開口邀請公生在比賽時擔任她的伴奏…',
        imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/25/0010622563.jpg&v=52dcfd21&w=348&h=348'
    },
    {
        title: '四月是你的謊言 2',
        price: 80,
        description: '公生答應在二次預賽中擔任小薰的鋼琴伴奏。比賽一開始公生還能順利彈琴，但在中途又再次因為聽不見鋼琴的聲音而停手。沒想到小薰也跟著停止演奏、等候公生。原本心灰意冷的公生因此重新振作，與小薰合奏出驚人的樂章…......',
        imageUrl: 'https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/31/0010623172.jpg&v=52dcfd21&w=348&h=348'
    },
    {
        title: '四月是你的謊言 3',
        price: 80,
        description: '在小薰的逼迫之下，公生不得不參加音樂比賽。為了參加比賽，公生從早到晚不停的練習，但就是無法彈奏出屬於自己的巴哈與蕭邦。此時，公生的面前出現兩位強勁的對手-相座武士與井川繪見，他們曾經是公生的手下敗將，一心想在比賽中擊敗公生雪恥。先上台演奏的武士彈奏出令全場喝采的激昂樂章…',
        imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/76/0010627615.jpg&v=5315ab5f&w=348&h=348'
    },
];

//get寫在use之後，因get會進到別的頁面(?)，不會再進中介軟體
//預設發起請求後會自動結束，所以不需要next參數
//處理路由/的get請求
app.get('/', (req, res) => {
    // res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.write('<head><meta charset="utf-8" /></head>')
    // res.write('<body>')
    // res.write('<h1>這是首頁</h1>')
    // res.write('</body>')
    // res.status(200).sendFile(path.join(__dirname, 'views', 'index.html')); //把node資料夾>views>index.html的檔案拿來顯示
    res.status(200).render('index.ejs',{
        pageTitle: 'This is index page.',
        products: products, //將常數 products 賦予給路由參數products，products: products可簡寫成products(key和value相同)
        path: '/' 
    });
});

app.get('/login', (req, res) => {
    // res.status(200).sendFile(path.join(__dirname, 'views', 'login.html')); //把node資料夾>views>login.html的檔案拿來顯示
    res.status(200).render('login.ejs',{
        pageTitle: 'This is login page.',
        path: '/login'
    });
});

//處理post請求
app.post('/login', (req, res) => {
    const { email, password } = req.body; //ES6解構賦值
    if (email && password) { //如果有填寫信箱密碼就導至首頁
        res.redirect('/');
    } else { //沒填寫完全則console.log提示訊息
		console.log('欄位尚未填寫完成！')
    }
});

//萬用路由*，要放在所有路由設定之後
app.get('*', (req, res) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); //把node資料夾>views>404.html的檔案拿來顯示
    res.status(200).render('404.ejs',{
        pageTitle: 'This is 404 page.'
    });
});

app.listen(3030, () => {
	console.log('Web Server is running on port 3030');
});