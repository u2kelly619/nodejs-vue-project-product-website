//引入product model
const Product = require('../models/product');

// const getIndex = (req, res) => {
//     // res.writeHead(200, { 'Content-Type': 'text/html' });
//     // res.write('<head><meta charset="utf-8" /></head>')
//     // res.write('<body>')
//     // res.write('<h1>這是首頁</h1>')
//     // res.write('</body>')
//     // res.status(200).sendFile(path.join(__dirname, 'views', 'index.html')); //把node資料夾>views>index.html的檔案拿來顯示
//     Product.findAll(); //回傳陣列
//     res.status(200).render('index.ejs',{
//         pageTitle: 'This is index page.',
//         products: products, //將常數 products 賦予給路由參數products，products: products可簡寫成products(key和value相同)
//         path: '/' 
//     });
// }

const getIndex = (req, res) => {
    Product.findAll()
        .then((products) => {
            res.status(200)
                .render('index', {
                    path: '/',
                    pageTitle: 'Book Your Books online',
                    products
                });
        })
        .catch((err) => {
            console.log('Product.findAll() error: ', err);
        })
};

const getCart = (req, res) => {
    req.user
        .getCart() //取得DB物件
        .then((cart) => {
            return cart.getProducts()
                .then((products) => {
                    res.render('shop/cart', {
                        pageTitle: 'Cart',
                        products,
                        amount: cart.amount
                    });
                })
                .catch((err) => {
                    console.log('getCart - cart.getProducts error: ', err);
                })
        })
        .catch((err) => {
            console.log('getCart - user.getCart error', err);
        })
}

const postCartAddItem = (req, res) => {
    //post過來的資料(productId)為req.body(用bodyParser解讀)
    const { productId } = req.body;
    let userCart; //userCart = []
    let newQuantity = 1;
    req.user //已是user模型不是純資料，可以使用sequelize的方法，在app.js有用User.findByPk(req.session.user.id)，find by primary key，用id去找，取得該id的user model
        .getCart() //sequelize自動產生的方法
        .then((cart) => {
            userCart = cart;
            //檢查product是否已在cart(productId是從hidden的input裡傳過來的，把它當作篩選條件)
            return cart.getProducts({ where: { id: productId }}); //sequelize自動產生的方法，因關聯是多對多，會在product加上s
        }) //取得陣列
        .then((products) => {
            let product;
            if (products.length > 0) { //如果有資料(陣列長度>0)，表示購物車已經有該product
                product = products[0]; //抓陣列的第一筆(也只會有一筆)
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1; //把原本數量+1
                return product;
            }
            return Product.findByPk(productId);
        })
        .then((product) => {
            return userCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        //處理總額加總
        .then(() => {
            //取得所有產品
            return userCart.getProducts();
        })
        .then((products) => {
            //算出每個產品的總額，map格式轉換成陣列
            const productsSums = products.map((product) => product.price * product.cartItem.quantity); //回傳[80,400]
            //reduce():將陣列處理成單一結果，常用在加總
            const amount = productsSums.reduce((accumulator, currentValue) => accumulator + currentValue);
            userCart.amount = amount;
            return userCart.save(); //儲存，寫入資料庫
        })
        .then(() => {
            res.redirect('/cart'); //導回cart頁面
        })
        .catch((err) => {
            console.log('postCartAddItem error: ', err);
        })
};

const postCartDeleteItem = (req, res, next) => {
    const { productId } = req.body; //指定id不然不知道要刪除哪一筆
    let userCart;
    req.user
        .getCart()
        .then((cart) => {
            userCart = cart;
            return cart.getProducts({ where: { id: productId }});
			//同個cart的同個product會記錄在同個productId，要刪除該product就要用productId來篩選
        })
        .then((products) => {
            const product = products[0];
            return product.cartItem.destroy(); //毀滅該筆cartItem
			//cartItem串起product跟cart表格
        })
		//重新計算總額
        .then(() => {
            return userCart
                .getProducts()
                .then((products) => {
                    if (products.length) {
                        const productSums = products.map((product) => product.price * product.cartItem.quantity);
                        const amount = productSums.reduce((accumulator, currentValue) => accumulator + currentValue);
                        userCart.amount = amount;
                        return userCart.save();
                    }
                });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => console.log(err));
};


//建議用物件寫法
module.exports = {
    getIndex,
    // getProduct,
    getCart,
    postCartAddItem,
    postCartDeleteItem
}

// const products = [
//     {
//         title: '四月是你的謊言 1',
//         price: 80,
//         description: '有馬公生的母親一心想把有馬培育成舉世聞名的鋼琴家，而有馬也不負母親的期望，在唸小學時就贏得許多鋼琴比賽的大獎。11歲的秋天，有馬的母親過世，從此他再也聽不見自己彈奏的鋼琴聲，沮喪的他也只好放棄演奏，但在14歲那年，經由兒時玩伴的介紹，有馬認識了小提琴手宮園薰，並被薰的自由奔放吸引，沒想到薰竟開口邀請公生在比賽時擔任她的伴奏…',
//         imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/25/0010622563.jpg&v=52dcfd21&w=348&h=348'
//     },
//     {
//         title: '四月是你的謊言 2',
//         price: 80,
//         description: '公生答應在二次預賽中擔任小薰的鋼琴伴奏。比賽一開始公生還能順利彈琴，但在中途又再次因為聽不見鋼琴的聲音而停手。沒想到小薰也跟著停止演奏、等候公生。原本心灰意冷的公生因此重新振作，與小薰合奏出驚人的樂章…......',
//         imageUrl: 'https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/31/0010623172.jpg&v=52dcfd21&w=348&h=348'
//     },
//     {
//         title: '四月是你的謊言 3',
//         price: 80,
//         description: '在小薰的逼迫之下，公生不得不參加音樂比賽。為了參加比賽，公生從早到晚不停的練習，但就是無法彈奏出屬於自己的巴哈與蕭邦。此時，公生的面前出現兩位強勁的對手-相座武士與井川繪見，他們曾經是公生的手下敗將，一心想在比賽中擊敗公生雪恥。先上台演奏的武士彈奏出令全場喝采的激昂樂章…',
//         imageUrl: 'https://im2.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/062/76/0010627615.jpg&v=5315ab5f&w=348&h=348'
//     },
// ];