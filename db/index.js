var redis = require("redis");

var client = redis.createClient(config.redis.port, config.redis.host, config.redis.opt);
client.on('connect', function () {
	console.log('redis connected success');
})
var db = {client : client}

module.exports = db;