var Joi = require('joi');
var Controllers = require('../controllers');


exports.register = function (server, options, next) {
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: Controllers.home
        }, {
            method: 'GET',
            path: '/image/{id}',
            handler: Controllers.images
        }, {
            method: 'POST',
            path: '/images',
            config: Controllers.imageUpload
        }, {
            method: 'POST',
            path: '/images/{id}/like',
            handler: function (request, reply) {
                reply('like image id: ' + request.params.id);
            }
        }, {
            method: 'POST',
            path: '/images/{id}/comment',
            handler: function (request, reply) {
                reply('Comment on image id: ' + request.params.id);
            }
        }
    ]);
    next();
};

exports.register.attributes = {
    name: 'images-routes',
    version: '0.1.0'
};