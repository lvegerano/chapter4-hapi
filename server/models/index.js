var fs = require('fs');
var path = require('path');


var models = {};

module.exports = function (mongoose) {

    fs
        .readdirSync(__dirname)
        .filter(function (file) {

            return (file.indexOf('.') !== 0) && (file !== 'index.js');
        })
        .forEach(function (file) {

            var name = file.replace(path.extname(file), '');
            models[name] = require('./' + name)(mongoose);
        });

        return models;
};
