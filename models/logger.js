module.exports = function(id) {
	var publ    = this,
		priv    = {},

		config  = require(process.cwd() + '/config.js'),

		XivelyClient    = require('xively'),
		xively          = new XivelyClient(),

		apiVer          = config.xivelyCredentials.apiVer,
		apiKey          = config.xivelyCredentials.apiKey,
		feedId          = config.xivelyCredentials.feedId,

		isLoggedIn      = false;

	publ.log = function(data, callback) {
		callback = callback || function() {};

		var datastreams = [];

		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				datastreams.push({
					id:             data[key].logName,
					current_value:  data[key].value
				})
			}
		}

		priv.logIn(function() {
			xively.feed.new(feedId, {
				data_point: {
					version:      apiVer,
					datastreams:  datastreams
				}
			});

			callback();
		});
	};

	priv.logIn = function(callback) {
		callback = callback || function () {};
		
		if(!isLoggedIn) {
			xively.setKey(apiKey);

			isLoggedIn = true;

			callback();
		} else {
			callback();
		}
	}
};