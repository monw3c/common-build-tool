//获取项目入口js文件
const path = require('path');
const fs = require('fs');

function getEntry() {
    var jsPath = path.resolve(__dirname, 'src/js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [],
        files = {};
    dirs.forEach(function(item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve('src', 'js', item);
        }
    });
    console.log(files)
    return files;
}

getEntry()