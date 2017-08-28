require('../css/web.css');
require('./libs/jquery203.js');
const welcomeMessage = 'ES2015 is awesome';
const content = `kill, ${welcomeMessage}`;
let container = $('#container');
container.text(content);