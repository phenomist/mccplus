var finalhandler = require('finalhandler'),
    http = require('http'),
    serveStatic = require('serve-static');

var serve = serveStatic('.');
var server = http.createServer(function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');

	var done = finalhandler(req, res);
	serve(req, res, done);
});

server.listen(4000);
console.log('Listening on port 4000');
