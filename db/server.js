var client = require('./index').client;

var server = {}

server.list = function (cb) {
	client.hgetall(util.KEY.SERVER, function (err, reply) {
		if(err){
			console.log('err:', err);
			return cb(util.ERROR.REDIS_ERROR);
		}else{
			return cb(null, reply);
		}
	});
}

server.add = function (data, cb) {
	console.log(data);
	var server = {
		name: data.name,
		host: data.host,
		tbandwidth: 0,
		tlink: 0,
		status: data.status ? data.status : util.STATUS.SERVER_DOWN
	}
	client.hset(util.KEY.SERVER, server.host, JSON.stringify(server), function (err, reply) {
		if(err || reply != 'OK'){
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

module.exports = server;