var client = require('./index').client;
var async = require("async");
var server = {}

// 服务：如：222.26.224.231:80

server.list = function (cb) {
	client.hgetall(util.KEY.SERVER, function (err, results) {
		if(err){
			console.log('err:', err);
			return cb(util.ERROR.REDIS_ERROR);
		}else{
			var data = [];
			var i = 0;
			for(result in results){
				data[i++] = JSON.parse(results[result]);
			}
			return cb(null, data);
		}
	});
}

server.add = function (data, cb) {
	var server = {
		name: data.name,
		host: data.host,
		link: 0,
		status: data.status ? data.status : util.STATUS.SERVER_DOWN
	}
	client.hset(util.KEY.SERVER, server.host, JSON.stringify(server), function (err, reply) {
		if(err){
			console.log(err, reply);
			return cb(util.ERROR.REDIS_ERROR);
		}else if(reply != 1){
			return cb(util.ERROR.REDIS_DATA_EXIST);
		}else{
			return cb(null);
		}

	});
}

server.delete = function (host, cb) {
	if(!host || host == ""){
		return cb(util.ERROR.PARAM_ERROR);
	}
	client.hdel(util.KEY.SERVER, host, function (err, reply) {
		if(err || reply != 'OK'){
			console.log(err, reply);
			return cb(util.ERROR.REDIS_ERROR);
		}else{
			return cb();
		}
	});
}

server.changeStatus = function (host, status, cb) {

	async.waterfall([
			function (callback) {
				client.hget(util.KEY.SERVER, host, callback);
			},
			function (reply, callback) {
				if(!reply)
					return callback();
				var server = JSON.parse(reply);
				server.status = status;
				client.hset(util.KEY.SERVER, host, JSON.stringify(server), callback);
			}
		], function (err) {
			if(err){
				console.log('err', err);
				return cb(util.ERROR.REDIS_ERROR);
			}else{
				return cb();
			}
		});
}

// 可能要修改的函数
// 当前功能:获取server最小的host
server.getLowestServer = function (cb) {
	var argv = [util.KEY.SERVER_LINK, "-inf", "+inf", 'LIMIT', 0, 1];
	client.ZRANGEBYSCORE(argv, function (err, reply) {
		if(err) {
			console.log("getLowestServer", err);
			return cb(util.ERROR.REDIS_ERROR);
		}
		cb(null, reply[0]);
	});

}

server.get = function (host, cb) {
	client.hget(util.KEY.SERVER, host, function (err, res) {
		if(err) {
			console.log(err);
			return cb(util.ERROR.REDIS_ERROR);
		}
		return cb(null, JSON.parse(res));
	});
}

module.exports = server;