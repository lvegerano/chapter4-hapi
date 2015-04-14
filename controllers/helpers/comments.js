var async = require('async');

module.exports = {
    newest: function(models, callback) {

        models.comments.find({}, {}, { limit: 5, sort: { timestamp: -1 } }, function (err, comments) {

            var attachImage = function (comment, next) {

                models.comments.findOne({ _id: comment.imageId}, function (err, image) {

                    if (err) {
                        return next(err);
                    }

                    comment.image = image;
                    next(err);
                });
            };

            async.each(comments, attachImage, function (err) {

                return callback(err, comments);
            });
        });
    }
};
