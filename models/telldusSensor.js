var telldus     = require('telldus'),
	callbacks   = [];

// This listener doesn't seem to be thread safe and crashes when having more than one listener
telldus.addSensorEventListener(function() {
	var that = this,
		args = arguments;

	callbacks.forEach(function(func) {
		func.apply(that, args)
	});
});

// Override for addSensorEventListener
telldus.addSensorCallback = function(callback) {
	callbacks.push(callback || function() {});
}

// Real object starts here
module.exports = function(id) {
	var publ    = this,
		priv    = {},

		lastTimestamp   = new Date(),
		lastValue       = 0;

	telldus.addSensorCallback(function(deviceId, protocol, model, type, value, timestamp) {
		if (deviceId === id && type === 1) {
			lastTimestamp   = new Date(timestamp * 1000);
			lastValue       = parseFloat(value);
		}
	});

	publ.read = function(callback) {
		callback = callback || function() {};

		callback(lastValue);
	}
};