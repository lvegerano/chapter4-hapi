var Stats = require('./helpers/stats');
var Images = require('./helpers/images');
var Comments = require('./helpers/comments');


module.exports = function (viewModel, callback) {

    viewModel.sidebar = {
        stats: Stats(),
        popular: Images.popular(),
        comments: Comments.newest()
    };

    return callback(null, viewModel);
};
