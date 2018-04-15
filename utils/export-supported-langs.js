/* eslint-disable */

var fs = require('fs');
var path = require('path');
var AFINN_PATH = path.resolve(__dirname, '../build/languages');

var langs = [];
fs.readdirSync(AFINN_PATH).forEach(function(file) {
    var matches = file.match(/AFINN-(.*)\.json/);
    if (matches) langs.push(matches[1]);
});

console.log(JSON.stringify(langs));