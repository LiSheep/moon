var async = require("async");
var request_db = require('../db/request');
var server_db = require('../db/server');
var resource_db = require('../db/resource');
var request = {};

function res301 (res, host, uri) {
	var url = "http://" + host + "/video/" + uri;
	res.writeHead(307, {"Location": url});
}

// 可能要修改的函数
// 当前功能：
// 0、查看资源是否存在
// 1、获取最近是否请求该URI的服务。有:2, 无:3
// 2、判断该服务link是否小于阀值。 有:4, 无:3
// 3、获取link最小的服务。
// 4、得出结果。
request.get = function (req, res) {
	console.log("request uri: ", req.params.uri);
	var resource_path = "";
	async.waterfall([
		function (callback) {
			// 查看资源是否存在
			resource_db.get(req.params.uri, function (err, data) {
				if(!data){
					return callback(util.ERROR.RESOURCE_NO_EXIST);
				}else{
					resource_path = data.path;
					callback(err);
				}
			});
		},
		function (callback) {
			// 获取最近是否请求该URI的服务
			request_db.get(req.params.uri, callback);
		},
		function (hosts, callback) {
			// 判断该服务link是否小于阀值
			if(!hosts){
				return callback(null);
			}
			server_db.get(hosts[0], function (err, data) {
				if(err){
					console.log("route/server:server_db.get", err);
					return callback(err);
				}
				if(data == null){
					console.log("server not exist");
					return callback(null);
				}
				// 判断该服务link是否小于阀值
				if(data.status != util.STATUS.DOWN && data.link < config.request.MAX_LINK){
					console.log("server ok, use old link");
					return callback(util.ERROR.OK, data.host);
				}else{
					callback(null);
				}
			});
		},
		function (callback) {
			// 获取link最小的服务
			console.log("get lowerest server.");
			server_db.getLowestServer(callback);
		}
		],
		function (err, result) {
			if(err && err != util.ERROR.OK){
				console.log("error get", err);
				res.writeHead(404);
				res.end(err);
				return;
			}
			if(!result){
				console.log("result null, maybe no server active!");
				res.writeHead(404);
				res.end("result null, maybe no server active!");
				return;
			}
			request_db.add(req.params.uri, result, function (err) {
				if(err){
					res.writeHead(404);
					res.end(err);
					return;
				}
				console.log("select:", result);
				res301(res, result, resource_path);
				res.end();
			});
		}
	);
}


module.exports = request;