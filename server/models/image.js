var path = require('path');


module.exports = function (mongoose) {

    var ImageSchema = new mongoose.Schema({
        title: { type: String },
        description: { type: String },
        filename: { type: String },
        views: { type: Number, 'default': 0 },
        likes: { type: Number, 'default': 0 },
        timestamp: { type: Date, 'default': Date.now }
    });

    ImageSchema.virtual('uniqueId')
        .get(function () {
            var self = this;
            return this.filename.replace(path.extname(this.filename), '');
        });

    return mongoose.model('Image', ImageSchema);
};
