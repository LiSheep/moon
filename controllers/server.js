var server = {}

var async = require("async");
var server_db = require('../db/server');
var request_db = require('../db/request');

// 轮询目标服务器
server.poll = function () {
	console.log("poll begin...");
	async.waterfall([
		function (callback) {
			server_db.list(function (err, results) {
				if(err) 
					return callback(err);
				for(result in results){
					if(result.status == util.STATUS.DOWN)
						continue;
					
				}
			});
		},
		function (callback) {
			
		}
		], function (err) {
			if(err){
				console.log("poll err", err);
			}
		})

}



module.exports = server;