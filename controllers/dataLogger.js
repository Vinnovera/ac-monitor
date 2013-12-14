module.exports = new function() {
	var publ    = this,
		priv    = {},

		moment          = require('moment'),
		temperatures    = require(process.cwd() + '/facades/temperatures.js'),
		Logger          = require(process.cwd() + '/models/logger.js'),
		logger          = new Logger,

		interval    = 300000, // 5 minute interval
		timer       = null;


	publ.start = function() {
		if (timer) {
			clearInterval(timer);
		}

		timer = setInterval(function() {
				temperatures.getCurrent(function(temperatures) {
					var now = moment();
					logger.log({
						date:       now.format('YYYY-MM-DD HH.mm.ss'),
						inside:     temperatures.inside,
						outside:    temperatures.outside
					});
				})
		}, interval)
	};
}