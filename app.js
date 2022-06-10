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
// const connectFlash = require('connect-flash');
//csrf保護機制套件
// const csrfProtection = require('csurf');

//------第三個區塊，自建模組------
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
//引入models的Cart模組
const Cart = require('./models/cart');
//引入models的CartItem模組
const CartItem = require('./models/cart-item');

//------middleware (由上而下執行)------

//設定ejs
// app.set('view engine', 'ejs'); //使用ejs的view engine樣板引擎
// app.set('views', 'views'); // views的預設路徑就是views資料夾，如果沒有變動，可以省略此設定

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
app.use(bodyParser.json());
//使用connect-flash模組
// app.use(connectFlash());

//使用express-session中介軟體的函式
app.use(session({ 
	secret: 'sessionToken',  // 加密用的字串
	resave: false,   // 沒變更內容是否強制回存
	saveUninitialized: false ,  // 新 session 未變更內容是否儲存
	cookie: {
		maxAge: oneDay // session 狀態儲存多久？單位為毫秒
	}
})); 

//使用csrf模組，要放在express和bodyParser之後
// app.use(csrfProtection());

app.use((req, res, next) => {
    //res.locals, session都是express-session設定的全域變數，每個模板都可以使用
    //把path存到全域變數，後續可以直接使用，render時不用再傳入path參數
    res.locals.path = req.url;
    //把isLogin存在全域變數，登入狀態(布林值)
    res.locals.isLogin = req.session.isLogin || false;
    //把csrfToken存在全域變數
    // res.locals.csrfToken = req.csrfToken();
    next();
});

//使用 req.session.user 資料，接著查詢資料庫關於這個使用者的細節資訊，並把它存放到全域變數中（req.user）
app.use((req, res, next) => {
    if (!req.session.user) { //沒有資料表示沒有登入
        return next();
    }
	//如果已登入的話，findByPk:find by primary key，用id去找，取得該id的user model，為了拿到sequelize的方法，純資料無法使用這些方法
    User.findByPk(req.session.user.id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log('custom middleware - findUserBySessionId error: ', err);
        })
});


//使用auth.js的模組
app.use(authRoutes);
//使用shop.js的模組
app.use(shopRoutes);
//使用error.js的模組
app.use(errorRoutes);

//用sequelize提供的方法建立關係
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

//引入products產品資料來bulkCreate(products)倒入資料庫
const products = require('./products');

// app.listen(3030, () => {
// 	console.log('Web Server is running on port 3030');
// });
//改寫成promise:
database
    //因為要測試資料，先清空reset再開始執行，之後可以拿掉
	// .sync({ force: true }) //和DB連線時，強制重設DB
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



// const products = [
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
// ];