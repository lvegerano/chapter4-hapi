var Hoek = require('hoek');
var Boom = require('boom');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var randomString = require('random-string');
var sidebar = require('./sidebar');
var md5 = require('MD5');


var internals = {};


internals.viewModelHome = {
    images: [
        {
            uniqueId:       1,
            title:          'Sample Image 1',
            description:    '',
            filename:       'sample1.jpg',
            views:          0,
            likes:          0,
            timestamp:      moment(Date.now()).startOf('minute').fromNow()
        }, {
            uniqueId:       2,
            title:          'Sample Image 2',
            description:    '',
            filename:       'sample2.jpg',
            views:          0,
            likes:          0,
            timestamp:      moment(Date.now()).startOf('minute').fromNow()
        }, {
            uniqueId:       3,
            title:          'Sample Image 3',
            description:    '',
            filename:       'sample3.jpg',
            views:          0,
            likes:          0,
            timestamp:      moment(Date.now()).startOf('minute').fromNow()
        }, {
            uniqueId:       4,
            title:          'Sample Image 4',
            description:    '',
            filename:       'sample4.jpg',
            views:          0,
            likes:          0,
            timestamp:      moment(Date.now()).startOf('minute').fromNow()
        }
    ]
};

internals.viewModelImage = {
    images: {},
    comments: []
};

internals.imageSave = function (request, callback) {

    var Models = request.server.plugins['mongoose-connector'].models;
    var imgUrl = randomString({
        length: 6,
        numeric: true,
        letters: true,
        special: false
    });

    Models.image.find({ filename: imgUrl }, function (err, images) {
        
        if (images.length > 0) {
            internals.imageSave(request,callback);
        } else {
            var tempPath = request.payload.file.path;
            var ext = path.extname(request.payload.file.filename).toLowerCase();
            var targetPath = path.resolve('./public/upload/' + imgUrl + ext);
            var accepted = ['.png', '.jpg', '.jpeg', '.gif'];

            if (accepted.indexOf(ext) < 0) {
                fs.unlink(tempPath, function (err) {

                    err = err || new Error('Only images allowed');
                    return callback(err);
                });
            } else {
                fs.rename(tempPath, targetPath, function (err) {

                    if (err) {
                        return callback(err);
                    }

                    var newImage = new Models.image({
                        title: request.payload.title,
                        filename: imgUrl + ext,
                        description: request.payload.description
                    });

                    newImage.save(function (err, image) {

                        if (err) {
                            return callback(err);
                        }

                        return callback(err, image.uniqueId);
                    });
                });
            }
        }
    });
};


exports.home = function (request, reply) {

    var Models = request.server.plugins['mongoose-connector'].models;
    Models.image.find({}, {}, { sort: { timestamp: -1 }}, function (err, images) {

        if (err) {
            return reply(Boom.badImplementation());
        }

        var viewModel = {};
        viewModel.images = images;
        sidebar(viewModel, Models, function (err, viewModel) { // appends sidebar data

            return reply.view('index', viewModel);
        });
    });
};

exports.image = function (request, reply) {

    var Models = request.server.plugins['mongoose-connector'].models;
    Models.image.findOne({ filename: { $regex: request.params.id } }, function (err, image) {

        var viewModel = {};

        if (err) {
            return reply(Boom.badImplementation(err));
        }

        if (image) {
            image.views += 1;
            viewModel.images = image;
            image.save();

            Models.comments.find({imageId: image._id}, {}, {sort: {'timestamp': 1}},
                function (err, comments) {

                    viewModel.comments = comments;
                    sidebar(viewModel, Models, function (err, viewModel) {

                        return reply.view('image', viewModel);
                    })
                }
            );
        } else {
            return reply.redirect('/');
        }
    });
};

exports.imageUpload = {
    payload: {
        output: 'file',
        parse: true,
        maxBytes: 5242880,
        uploads: './temp'
    },
    handler: function (request, reply) {

        internals.imageSave(request, function (err, imageId) {

            if (err) {
                return reply(Boom.badImplementation(err));
            }

            return reply.redirect('/image/' + imageId);
        });
    }
};

exports.imageLikes = function (request, reply) {

    var Models = request.server.plugins['mongoose-connector'].models;
    Models.image.findOne({ filename: { $regex: request.params.id } }, function (err, image) {

        if (err) {
            return reply(Boom.badImplementation(err));
        }

        if (image) {
            image.likes += 1;
            image.save(function (err) {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply({ likes: image.likes });
            });
        }
    });
};

exports.comments = function (request, reply) {

    var Models = request.server.plugins['mongoose-connector'].models;

    Models.image.findOne({ filename: { $regex: request.params.id } }, function (err, image) {

        if (err) {
            return reply(Boom.badImplementation(err));
        }

        if (image) {
            var newComment = new Models.comments(request.payload);
            newComment.gravatar = md5(newComment.email);
            newComment.imageId = image._id;
            newComment.save(function (err, comment) {

                if (err) {
                    return reply(Boom.badImplementation(err));
                }

                return reply.redirect('/images/' + image.uniqueId + '#' + comment._id);
            });
        } else {
            return reply.redirect('/');
        }
    });
};
