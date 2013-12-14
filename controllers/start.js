module.exports = new function() {
	var publ    = this,
		priv    = {},

		temperatures = require(process.cwd() + '/facades/temperatures.js');

	publ.index = function(req, res) {
		res.render('index', {
			tempInside:     temperatures.getLast('inside').toFixed(1),
			tempOutside:    temperatures.getLast('outside').toFixed(1)
		});
	};
}