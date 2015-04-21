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
            path: '/images/{id}',
            handler: Controllers.image
        }, {
            method: 'POST',
            path: '/images',
            config: Controllers.imageUpload
        }, {
            method: 'POST',
            path: '/images/{id}/like',
            handler: Controllers.imageLikes
        }, {
            method: 'POST',
            path: '/images/{id}/comment',
            handler: Controllers.comments
        }, {
            method: 'DELETE',
            path: '/images/{id}/remove',
            handler: Controllers.remove
        }
    ]);

    return next();
};

exports.register.attributes = {
    name: 'images-routes',
    version: '0.1.0'
};
