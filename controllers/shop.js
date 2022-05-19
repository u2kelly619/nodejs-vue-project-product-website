const getIndex = (req, res) => {
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
}

//建議用物件寫法
module.exports = {
    getIndex
}