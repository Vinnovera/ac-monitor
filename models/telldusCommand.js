module.exports = function() {
	var publ    = this,
		priv    = {};

		telldus = require('telldus');

	publ.send = function(command, state, callback) {
		callback = callback || function() {};

		if (state === 'on') {
			telldus.turnOn(command, callback);
		}
		else {
			telldus.turnOff(command, callback);
		}
	}
};