var Joi = require('joi');

exports.register = function (server, options, next) {
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
                reply.view('main',{});
            }
        }, {
            method: 'GET',
            path: '/images/{id}',
            handler: function (request, reply) {
                reply('the id is ' + request.params.id);
            }
        }, {
            method: 'POST',
            path: '/images',
            handler: function (request, reply) {
                reply('need to save file');
            }
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
