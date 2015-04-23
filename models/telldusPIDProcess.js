module.exports = function(pId, pSensor) {
	var publ        = this,
		priv        = {},

		telldus     = require('telldus'),
		sensors     = require(process.cwd() + '/facades/sensors.js'),
		Controller  = require('node-pid-controller'),

		id          = parseInt(pId),
		sensor      = pSensor,
		enabled     = false,
		state       = 'off',
		controller  = new Controller(1.0, 0.01, 0.01),
		target      = null;

	publ.setEnabled = function(pEnabled) {
		enabled = pEnabled;
	}

	publ.setTarget = function(pTarget) {
		if (target !== pTarget) {
			target = pTarget;
			controller.setTarget(target);
		}
	}

	publ.update = function() {
		var input, output;

		if (enabled === true) {
			input = sensors.getLast(sensor);

			if (typeof input === 'number') {
				output  = controller.update(input);

				if (output > 0 && state === 'off') {
					console.log('turning on ' + sensor + ' value:' + input + ' target:' + target + ' output:' + output);
					telldus.turnOn(id);
					state = 'on';
				}
				else if (output <= 0 && state === 'on') {
					console.log('turning off ' + sensor + ' value:' + input + ' target:' + target + ' output:' + output);
					telldus.turnOff(id);
					state = 'off';
				}
				else {
					console.log('keeping ' + state + ' ' + sensor + ' value:' + input + ' target:' + target + ' output:' + output)
				}
			}
		}
		else if (state === 'on') {
			console.log('turning off ' + sensor);
			telldus.turnOff(id);
			state = 'off';
		}
	}
};