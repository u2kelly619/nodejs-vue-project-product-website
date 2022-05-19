const getAll = (req, res) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); //把node資料夾>views>404.html的檔案拿來顯示
    res.status(404).render('404.ejs',{
        pageTitle: 'This is 404 page.',
        path: '*'
    });
}

//建議用物件寫法
module.exports = {
    getAll
}