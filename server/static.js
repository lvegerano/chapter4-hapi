
exports.register = function (server, options, next) {

    server.route([
        {
            method: 'GET',
            path: '/public/{path*}',
            handler: {
                directory: {
                    path: './public'
                }
            }
        }
    ]);

    return next();
};


exports.register.attributes = {
    name: 'static-files',
    version: '0.1.0'
};
