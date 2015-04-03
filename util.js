var util = {};

util.KEY = {
	SERVER: 'server',	// hash
	RESOURCE: 'resource',	// hash
	SERVER_CURRENT_BANDWIDTH: 'server:currbandwidth',	// zset
	SERVER_CURRENT_LINK: 'server:currlink',	// zset
};

util.STATUS = {
	SERVER_DOWN: "down",
	SERVER_UP: "up",
	SERVER_BANDWIDTH_OVERLOAD: "over",
	SERVER_LINK_OUT: "out",
	
};

util.ERROR = {
	REDIS_ERROR: "数据库出错",
	PARAM_ERROR: "参数错误，别调皮乱传参丫!",
	REDIS_DATA_EXIST: "重复添加数据"
};

module.exports = util;