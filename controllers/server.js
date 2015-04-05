var server = {}

var async = require("async");
var restify = require('restify');
var server_db = require('../db/server');
var request_db = require('../db/request');

function updateServer(host) {
	async.waterfall([
		function (callback) {
			var port_index = host.indexOf(':');
			var ip = host.substr(0, port_index);
			port = host.substr(port_index+1);
			var client = restify.createJsonClient({
				url: 'http://' + ip +':' + config.api.port,
				version: config.api.version
			});
			client.get('/link/' + port, function (err, req, res, obj) {
				console.log("host: " + host + " link_num: " + obj);
				callback(err, host, obj);
			});
		},
		function (host, link, callback) {
			server_db.updateLink(host, link, callback);
		}
		], function (err) {
			if(err){
				console.log("update host: " + host + " error:", err);
			}
		});
}

// 轮询目标服务器
server.poll = function () {
	console.log("poll begin...");

	server_db.list(function (err, results) {
		if(err) 
			return callback(err);
		for(i in results){
			var result = results[i];
			if(result.status == util.STATUS.DOWN)
				continue;
			updateServer(result.host);
		}
	});
}



module.exports = server;