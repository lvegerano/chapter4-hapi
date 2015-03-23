var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
});

var options = {
    reporters: [{
        reporter: require('good-console'),
        args: [{ log: '*', response: '*' }]
    }]
};

server.path(process.cwd());

server.views({
    engines: {
        jade: require('jade')
    },
    path: './views',
    layoutPath: './views/layouts',
    partialsPath: './views/partials'
});

server.register([{
    register: require('good'),
    options: options
}, {
    register: require('./server/image')
}], function (err) {
    
    if (err) {
        throw new Error(err);
    }

    server.start(function (err) {

        if (err) {
            throw new Error(err);
        }

        console.log('Server running at ' + server.info.uri);
    });
});
