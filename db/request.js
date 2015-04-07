var client = require('./index').client;

var request = {};

request.add = function (uri, host, cb) {
	if(!uri || uri == "") {
		cb(util.ERROR.PARAM_ERROR);
	}
	var now = new Date();
	client.zadd(util.KEY.REQUEST + uri, now.getTime(), host, function (err, reply) {
		if(err){
			logger.log("error", "client.zadd(util.KEY.REQUEST)" + err + reply);
			return cb(util.ERROR.REDIS_ERROR);
		}else{
			return cb(null);
		}
	});
}

request.get = function (uri, cb) {
	if(!uri || uri == "") {
		cb(util.ERROR.PARAM_ERROR);
	}
	client.zrange(util.KEY.REQUEST + uri, 0, -1, function (err, reply) {
		if(err){
			logger.log("error", "client.zrange(util.KEY.REQUEST + uri)" + err);
			err = util.ERROR.REDIS_ERROR;
		}
		return cb(err, reply);
	});
}

module.exports = request;