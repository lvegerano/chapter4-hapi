module.exports = {
    popular: function(models, next) {
        models.image.find({}, {}, { limit: 9, sort: { likes: -1 } }, function (err, images) {
            return next(err, images);
        });
    }
};
