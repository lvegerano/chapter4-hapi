var mongoose = require('mongoose');


exports.register = function (server, options, next) {

    mongoose.connect('mongodb://192.168.99.100:49157/imgPloadr');
    mongoose.connection.on('open', function () {

        var models = require('./models')(mongoose);
        server.expose('models', models);
        return next();
    });
};

exports.register.attributes = {
    name: 'mongoose-connector',
    version: '0.1.0'
};
