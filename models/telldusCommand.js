module.exports = function() {
	var publ    = this,
		priv    = {},

		telldus = require('telldus');

	publ.send = function(id, state, callback) {
		callback = callback || function() {};

		if (state === 'on') {
			telldus.turnOn(id, callback);
		}
		else {
			telldus.turnOff(id, callback);
		}
	}
};