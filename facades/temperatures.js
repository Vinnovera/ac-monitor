module.exports = new function() {
	var publ    = this,
		priv    = {},

		async       = require('async'),
		Temperature = require(process.cwd() + '/models/temperature.js'),

		sensors = {};

	publ.registerSensor = function(id, name) {
		sensors[name] = {
			id:   id,
			obj:  new Temperature(id),
			last: null,
			date: null
		};

		publ.getCurrent(null, name);

		return this;
	};

	priv.updateSensor = function(name, temperature) {
		sensors[name].last = temperature;
		sensors[name].date = new Date;
	};

	publ.getLast = function(name) {
		if (name) {
			return sensors[name].last
		}

		var ret = {};
		for (var name in sensors) {
			ret[name] = sensors[name].last
		}
		return ret;
	};

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
