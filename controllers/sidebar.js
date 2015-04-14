var Stats = require('./helpers/stats');
var Images = require('./helpers/images');
var Comments = require('./helpers/comments');
var async = require('async');


module.exports = function (viewModel, models, callback) {

    async.parallel([
        function (next) {

            return next(null, Stats());
        },
        function (next) {

            return next(null, Images.popular());
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
