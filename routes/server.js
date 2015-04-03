var server_db = require('../db/server');
var server = {};

server.list = function (req, res) {
	server_db.list(function (err, results) {
		if(err){
			return res.end(err);
		}
		var data = [];
		var i = 0;
		for(result in results){
			data[i++] = JSON.parse(results[result]);
		}
		res.render("server/list", {servers: data});
	});
	
}

server.addView = function (req, res) {
	res.render("server/add");
}

server.add = function (req, res) {
	var data = req.body;
	if(!data.name || !data.host){
		res.end(util.ERROR.PARAM_ERROR);
		return;
	}
	server_db.add(data, function (err) {
		if(err)
			res.writeHead(404);
		res.end(err);
	});
}

server.delete = function (req, res) {
	server_db.delete(req.params.host, function (err) {
		if(err){
			res.writeHead(404);
		}
		res.end(err);
	})
}

server.down = function (req, res) {
	
}

module.exports = server;