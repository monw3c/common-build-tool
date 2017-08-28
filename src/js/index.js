require('../css/base.css');
require('./libs/jquery203.js');
const welcomeMessage = 'ES6 is awesome';
const content = `hello111111, ${welcomeMessage}`;
let container = $('#container');
container.text(content);