module.exports = function(id) {
	var publ    = this,
		priv    = {},

		path    = '/sys/bus/w1/devices/' + id + '/w1_slave',

		fs      = require('fs');

	priv.readRaw = function(callback) {
		callback = callback || function() {};
		return fs.readFile(path, "utf-8", callback);
	}

	priv.parse = function(raw) {
		var lines   = raw.split('\n'),
			status  = lines[0].match(/crc\=.{2} (YES|NO)/),
			temp    = lines[1].match(/t\=(-?\d+)/);

		if (status[1] === 'YES') {
			return parseInt(temp[1]) / 1000;
		}

		return false;
	}

	publ.read = function(callback) {
		callback = callback || function() {};
		priv.readRaw(function(err, raw) {
			var temp = priv.parse(raw);

			if (temp !== false) {
				callback(temp);
			}
			else {
				publ.read(callback);
			}
		});
		/*callback(Math.random()*100);*/
	}
};