var Hoek = require('hoek');
var Boom = require('boom');
var moment = require('moment');
var fs = require('fs');
var path = require('path');


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
    image: {
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

    var fileNameArray = request.payload.file.filename.split('.');
    var ext = fileNameArray[fileNameArray.length - 1];
    var accepted = ['png', 'jpg', 'jpeg', 'gif'];

    if (accepted.indexOf(ext) < 0) {
        return callback(new Error('Only image files allowed'));
    }

    console.log('saving file');
};


exports.home = function (request, reply) {

    reply.view('index', internals.viewModelHome);
};


exports.images = function (request, reply) {

    reply.view('image', internals.viewModelImage);
};


exports.imageUpload = {
    payload: {
        output: 'file',
        parse: true,
        maxBytes: 5242880
    },
    handler: function (request, reply) {

        console.log(request.payload);
        internals.imageSave(request, function (err) {

            Hoek.assert(!err, Boom.create(500, err));
            return reply();
        });
    }
};
