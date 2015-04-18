var Stats = require('./helpers/stats');
var Images = require('./helpers/images');
var Comments = require('./helpers/comments');
var async = require('async');


module.exports = function (viewModel, models, callback) {

    async.parallel([
        function (next) {

            return Stats(models, next);
        },
        function (next) {

            return Images.popular(models, next);
        },
        function (next) {

            return Comments.newest(models, next);
        }
    ], function (err, results) {

        viewModel.sidebar = {
            stats: results[0],
            popular: results[1],
            comments: results[2]
        };

        return callback(err, viewModel);
    });
};
