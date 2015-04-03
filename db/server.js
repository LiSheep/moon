var client = require('./index').client;
var async = require("async");
var server = {}

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
		tbandwidth: 0,
		tlink: 0,
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

module.exports = server;