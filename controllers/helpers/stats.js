var async = require('async');


module.exports = function (models, callback) {

    async.parallel([
        function (next) {
            return models.image.count({}, next);
        },
        function (next) {
            return models.comments.count({}, next);
        },
        function (next) {
            return models.image.aggregate({
                $group: {
                    _id: '1',
                    viewsTotal: { $sum: '$views' }
                }
            }, function (err, results) {

                var viewsTotal = 0;

                if (results.length > 0) {
                    viewsTotal += results[0].viewsTotal;
                }

                next(err, viewsTotal);
            });
        },
        function (next) {
            return models.image.aggregate({
                $group: {
                    _id: '1',
                    likesTotal: { $sum: '$likes' }
                }
            }, function (err, results) {
                
                var likesTotal = 0;
                
                if (results.length > 0) {
                    likesTotal += results[0].likesTotal;
                }

                next(err, likesTotal);
            })
        }
    ], function (err, results) {

        var stats = {
            images: results[0],
            comments: results[1],
            views: results[2],
            likes: results[3]
        };

        callback(err, stats);
    });
};
