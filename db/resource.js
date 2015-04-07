var client = require('./index').client;
var async = require("async");
var resource = {};

resource.list = function (query, pageNo, pageSize, cb) {
	client.hgetall(util.KEY.RESOURCE, function (err, results) {
		var start = (pageNo - 1) * pageSize;
		var end = pageNo * pageSize;
		if(err){
			logger.log("error", "client.hgetall(util.KEY.RESOURCE) " + err);
			return cb(util.ERROR.REDIS_ERROR);
		}else{
			var data = [];
			var i = 0;
			var j = 0;
			for(result in results){
				if(query.path) {
					if(JSON.parse(results[result]).path.indexOf(query.path) < 0){
						continue;
					}
				}
				if(query.uri) {
					if(JSON.parse(results[result]).uri.indexOf(query.uri) < 0)
						continue;
				}
				if(i < start){
					++i;
					continue;
				}
				if(i >= end){
					++i;
					break;
				}
				data[j++] = JSON.parse(results[result]);
				if(j == pageSize) {
					break;
				}

			}
			return cb(null, data);
		}
	});
}

resource.add = function (data, cb) {
	var resource = {
		path: data.path,
		uri: data.uri
	};
	client.hset(util.KEY.RESOURCE, resource.uri, JSON.stringify(resource), function (err, reply) {
		if(err){
			logger.log("error", "client.hset(util.KEY.RESOURCE) " + reply);
			return cb(util.ERROR.REDIS_ERROR);
		}else if(reply != 1){
			return cb(util.ERROR.REDIS_DATA_EXIST);
		}else{
			return cb(null);
		}
	});
}

resource.delete = function (uri, cb) {
	if(!uri || uri == ""){
		return cb(util.ERROR.PARAM_ERROR);
	}
	client.hdel(util.KEY.RESOURCE, uri, function (err, reply) {
		if(err){
			logger.log("error", "client.hdel(util.KEY.RESOURCE) " + err);
			return cb(util.ERROR.REDIS_ERROR);
		}else{
			return cb();
		}
	});
}

resource.update = function (olduri, newuri, cb) {
	async.waterfall([
			function (callback) {
				client.hget(util.KEY.RESOURCE, olduri, function (err, reply) {
					if(err){
						logger.log("error", "client.hget(util.KEY.RESOURCE) " + err);
						err = util.ERROR.REDIS_ERROR;
					}
					callback(err, JSON.parse(reply));
				});
			},
			function (data, callback) {
				data.uri = newuri;
				client.hset(util.KEY.RESOURCE, data.uri, JSON.stringify(data), function (err, reply) {
					if(err){
						logger.log("error", "client.hset(util.KEY.RESOURCE) " + err);
						return callback(util.ERROR.REDIS_ERROR);
					}else if(reply != 1){
						return callback(util.ERROR.REDIS_DATA_EXIST);
					}else{
						return callback(null);
					}
				});
			},
			function (callback) {
				client.hdel(util.KEY.RESOURCE, olduri, function (err, reply) {
					if(err){
						logger.log("error", "client.hdel(util.KEY.RESOURCE) " + err);
						return callback(util.ERROR.REDIS_ERROR);
					}else{
						return callback();
					}
				});
			}
		], function (err) {
			cb(err);
		});
}

resource.get = function (uri, cb) {
	if(!uri || uri == ""){
		return cb(util.ERROR.PARAM_ERROR);
	}
	client.hget(util.KEY.RESOURCE, uri, function (err, reply) {
		if(err){
			logger.log("error", "client.hget(util.KEY.RESOURCE) " + err);
			err = util.ERROR.REDIS_ERROR;
		}
		cb(err, JSON.parse(reply));
	});
}

module.exports = resource;