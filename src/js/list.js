//require('../css/web.css');
//require('./libs/jquery203.js');
import '../css/web.css';
import $ from 'jquery';
const welcomeMessage = 'ES2015 is awesome';
const content = `kill, ${welcomeMessage}`;
let container = $('#container');
container.text(content);