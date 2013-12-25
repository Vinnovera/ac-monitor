module.exports = new function() {
	var publ    = this,
		priv    = {},

		config          = require(process.cwd() + '/config.js'),

		temperatures    = require(process.cwd() + '/facades/temperatures.js');

	publ.index = function(req, res) {
		res.render('index', {
			refresh:        config.pollIntervall / 1000,
			tempInside:     temperatures.getLast('inside').toFixed(1),
			tempOutside:    temperatures.getLast('outside').toFixed(1),
			texts:          config.texts
		});
	};
}