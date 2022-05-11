// console.log("hello world");

//第一個區塊，內建模組
const path = require('path');
const http = require('http');

//第二個區塊，第三方模組(套件)

//第三個區塊，自建模組
const hello = require("./hello.js");

hello.sayHello();
hello.sayGoodNight();

const cowsay = require('cowsay');

let sentences = ['哈囉', '安安', '我是牛牛'];

sentences.forEach((sentence) => {
    console.log(cowsay.say({
        text : sentence,
        e : "^^",
        T : "U "
    }));
});