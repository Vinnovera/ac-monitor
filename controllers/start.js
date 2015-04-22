module.exports = new function() {
	var publ    = this,
		priv    = {},

		config  = require(process.cwd() + '/config.js'),

		sensors = require(process.cwd() + '/facades/sensors.js');

	publ.index = function(req, res) {
		res.render('index', {
			refresh:        config.pollInterval / 1000,
			xively:         config.xivelyCredentials,
			sensors:        sensors.getDetailedLast(null, 1),
			commands:       config.commands,
			texts:          config.texts
		});
	};
}