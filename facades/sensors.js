module.exports = new function() {
	var publ    = this,
		priv    = {},

		async   = require('async'),
		libs    = {
			'1wire':    require(process.cwd() + '/models/oneWireSensor.js'),
			'telldus':  require(process.cwd() + '/models/telldusSensor.js')
		},

		sensors = {};

	publ.registerSensor = function(id, type, name, color) {
		if (libs.hasOwnProperty(type)) {
			sensors[name] = {
				id:    id,
				obj:   new libs[type](id),
				type:  type,
				color: color,
				last:  null,
				date:  null
			};

			publ.getCurrent(null, name);
		}

		return this;
	};

	publ.registerSensors = function(sensors) {
		sensors = sensors || [];

		sensors.forEach(function(sensor) {
			publ.registerSensor(sensor.id, sensor.type, sensor.name, sensor.color);
		})
	};

	priv.updateSensor = function(name, temperature) {
		sensors[name].last = temperature;
		sensors[name].date = new Date;
	};

	publ.getLast = function(name, digits) {
		digits = typeof digits === 'number' ? digits : 20;

		if (name && sensors.hasOwnProperty(name)) {
			return sensors[name].last.toFixed(digits)
		}

		var ret = {};
		for (var name in sensors) {
			ret[name] = sensors[name].last.toFixed(digits)
		}
		return ret;
	};

	publ.getDetailedLast = function(name, digits) {
		digits = typeof digits === 'number' ? digits : 20;

		var sensor,
			ret = []

		if (name && sensors.hasOwnProperty(name)) {
			sensor = sensors[name];
			return {
				name:   name,
				id:     sensor.id,
				type:   sensor.type,
				color:  sensor.color,
				value:  sensor.last.toFixed(digits)
			};
		}

		for (var name in sensors) {
			sensor = sensors[name];
			ret.push({
				name:   name,
				id:     sensor.id,
				type:   sensor.type,
				color:  sensor.color,
				value:  sensor.last.toFixed(digits)
			});
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
}
