import '../css/base.css';
import '../css/iconfont.css';
import '../css/web.css';
import '../css/index.css';
import $ from 'jquery';
const welcomeMessage = 'ES6 is awesome';
const content = `hello111111, ${welcomeMessage}`;
let container = $('#container');
container.text(content);
let personArr = ['mon','30']
let {0:name,1:age} = personArr;
console.log(personArr)
container.append(`${name}是${age}啊啊啊`)