
module.exports = function (mongoose) {

    var CommentSchema = new mongoose.Schema({
        imageId: { type: mongoose.Schema.ObjectId },
        email: { type: String },
        name: { type: String },
        gravatar: { type: String },
        comment: { type: String},
        timestamp: { type: Date, 'default': Date.now }
    });

    CommentSchema.virtual('image')
        .set(function (image) {
            this._image = image;
        })
        .get(function () {
            return this._image;
        });

    return mongoose.model('Comment', CommentSchema);
};
