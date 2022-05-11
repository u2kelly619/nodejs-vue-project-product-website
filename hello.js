const sayHello = () => {
    console.log('Hello!');
};

const sayGoodNight = () => {
    console.log('Good night!');
};

const title = 'Hello Title';

// module.exports.sayHello = sayHello;

// module.exports = {
//     sayHello: sayHello,
//     sayGoodNight: sayGoodNight,
//     title: title
// };

//key和value一樣的話可以簡寫，只寫一個
module.exports = {
    sayHello,
    sayGoodNight,
    title,
};