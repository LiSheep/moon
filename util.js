var util = {};

util.KEY = {
	SERVER: 'server',	// hash
	RESOURCE: 'resource',	// hash
	SERVER_CURRENT_BANDWIDTH: 'server:currbandwidth',	// zset
	SERVER_CURRENT_LINK: 'server:currlink',	// zset
	REQUEST: "request:",
	SERVER_LINK: "server_link" // zset
};

util.STATUS = {
	SERVER_DOWN: "down",
	SERVER_UP: "up",
	SERVER_OVERLOAD: "overload",
	SERVER_LINK_OUT: "out",
	
};

util.ERROR = {
	OK: "OK",
	REDIS_ERROR: "数据库出错",
	PARAM_ERROR: "参数错误，别调皮乱传参丫!",
	REDIS_DATA_EXIST: "重复添加数据",
	RESOURCE_NO_EXIST: "资源不存在"
};

module.exports = util;