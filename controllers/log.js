var winston = require('winston');
require('winston-mongodb').MongoDB;


function log() {
	var logger = null;
	return function () {
		var transports = new Array();

		if(config.log.console) {
			transports.push(new (winston.transports.Console)({ 
				level: config.log.console_level 
			}) );
		}
		logger = new (winston.Logger)({
		    transports: [
				new (winston.transports.Console)(config.log.console),
				new (winston.transports.File)(config.log.file),
				// new (winston.transports.MongoDB)(config.log.mongodb)
		    ]
		});
		return logger;
	}
}


module.exports = log;