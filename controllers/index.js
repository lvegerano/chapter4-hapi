var Hoek = require('hoek');
var Boom = require('boom');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var randomString = require('random-string');
var sidebar = require('./sidebar');


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
    images: {
        uniqueId:       1,
        title:          'Sample Image 1',
        description:    'This is a sample.',
        filename:       'sample1.jpg',
        views:          0,
        likes:          0,
        timestamp:      moment(Date.now()).startOf('minute').fromNow()
    },
    comments: [
        {
            image_id:   1,
            email:      'test@testing.com',
            name:       'Test Tester',
            gravatar:   'http://lorempixel.com/75/75/animals/1',
            comment:    'This is a test comment...',
            timestamp:  moment(Date.now()).startOf('minute').fromNow()
        },{
            image_id:   1,
            email:      'test@testing.com',
            name:       'Test Tester',
            gravatar:   'http://lorempixel.com/75/75/animals/2',
            comment:    'Another followup comment!',
            timestamp:  moment(Date.now()).startOf('minute').fromNow()
        }
    ]
};

internals.imageSave = function (request, callback) {

    var imgUrl = randomString({
        length: 6,
        numeric: true,
        letters: true,
        special: false
    });
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

            return callback(err, imgUrl);
        });
    }
};


exports.home = function (request, reply) {

    sidebar(internals.viewModelHome, function (err, viewModel) {

        if (err) {
            throw err;
        }
        console.log(viewModel);
        return reply.view('index', viewModel);
    });
};


exports.images = function (request, reply) {

    sidebar(internals.viewModelImage, function (err, viewModel) {

        if (err) {
            throw err;
        }
        console.log(viewModel);
        //reply();
        return reply.view('image', internals.viewModelImage);
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

        internals.imageSave(request, function (err, imgUrl) {

            Hoek.assert(!err, Boom.create(500, err));
            return reply.redirect('/image/' + imgUrl);
        });
    }
};
