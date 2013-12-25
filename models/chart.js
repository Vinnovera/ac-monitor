module.exports = function() {
	var publ    = this,
		priv    = {},

		config  = require(process.cwd() + '/config.js'),

		request = require('request');

	publ.fetch = function(callback) {
		callback = callback || function() {};
		
		request(
			{
				url:      config.logChartImage,
				encoding: null //Creates buffer
			},
			function(err, res) {
				if (!err && res.statusCode == 200) {
					callback(res.body);
				}
			}
		);
	}

};