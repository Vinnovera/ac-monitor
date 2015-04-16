module.exports = new function() {
	var publ    = this,
		priv    = {},

		async   = require('async'),
		libs    = {
			'1wire':    require(process.cwd() + '/models/oneWireSensor.js'),
			'telldus':  require(process.cwd() + '/models/telldusSensor.js')
		},

		sensors = {};

	publ.registerSensor = function(id, type, name, color, logName) {
		if (libs.hasOwnProperty(type)) {
			sensors[name] = {
				id:      id,
				obj:     new libs[type](id),
				type:    type,
				color:   color,
				logName: logName,
				last:    null,
				date:    null
			};

			publ.getCurrent(null, name);
		}

		return this;
	};

	publ.registerSensors = function(sensors) {
		sensors = sensors || [];

		sensors.forEach(function(sensor) {
			publ.registerSensor(sensor.id, sensor.type, sensor.name, sensor.color, sensor.logName);
		})
	};

	priv.updateSensor = function(name, temperature) {
		sensors[name].last = temperature;
		sensors[name].date = new Date;

		return publ.getLast(name);
	};

	publ.getLast = function(name, digits) {
		digits = typeof digits === 'number' ? digits : 20;

		var sensor,
			ret = {}

		if (name) {
			if (sensors.hasOwnProperty(name) && typeof sensors[name].last  === 'number') {
				return sensors[name].last.toFixed(digits)
			}

			return false;
		}

		for (var name in sensors) {
			if (sensors.hasOwnProperty(name) && typeof sensors[name].last  === 'number') {
				ret[name] = sensors[name].last.toFixed(digits)
			}
		}
		return ret;
	};

	publ.getDetailedLast = function(name, digits) {
		digits = typeof digits === 'number' ? digits : 20;

		var sensor,
			ret = []

		if (name) {
			if (sensors.hasOwnProperty(name) && typeof sensors[name].last  === 'number') {
				sensor = sensors[name];

				return {
					name:    name,
					id:      sensor.id,
					type:    sensor.type,
					logName: sensor.logName,
					color:   sensor.color,
					value:   sensor.last.toFixed(digits)
				};
			}

			return false;
		}

		for (var name in sensors) {
			if (sensors.hasOwnProperty(name) && typeof sensors[name].last  === 'number') {
				sensor = sensors[name];

				if (typeof sensor.last === 'number') {
					ret.push({
						name: name,
						id: sensor.id,
						type: sensor.type,
						logName: sensor.logName,
						color: sensor.color,
						value: sensor.last.toFixed(digits)
					});
				}
			}
		}
		return ret;
	}

	publ.getCurrent = function(callback, name) {
		callback = callback || function() {};

		if (name) {
			sensors[name].obj.read(function(temperature) {
				priv.updateSensor(name, temperature)
				callback(temperature);
			});
		}

		var callbacks = [];
		for (var name in sensors) {
			(function(name) {
				callbacks.push(function(callback) {
					sensors[name].obj.read(function(temperature) {
						priv.updateSensor(name, temperature)
						callback();
					})
				})
			})(name);
		}

		async.parallel(callbacks, function() {
			callback(publ.getLast());
		});
	};

	publ.getDetailedCurrent = function(callback, name) {
		callback = callback || function() {};

		if (name) {
			sensors[name].obj.read(function(temperature) {
				callback(priv.updateSensor(name, temperature));
			});
		}

		var callbacks = [];
		for (var name in sensors) {
			(function(name) {
				callbacks.push(function(callback) {
					sensors[name].obj.read(function(temperature) {
						priv.updateSensor(name, temperature)
						callback();
					})
				})
			})(name);
		}

		async.parallel(callbacks, function() {
			callback(publ.getDetailedLast());
		});
	};
}
