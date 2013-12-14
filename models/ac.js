module.exports = function() {
	var publ    = this,
		priv    = {},

		lirc    = require('lirc_node'),

		remote  = 'AC';

	lirc.init();

	publ.wakeup = function(callback) {
		priv.send('KEY_WAKEUP', callback);
	}

	publ.sleep = function(callback) {
		priv.send('KEY_SLEEP', callback);

	}

	priv.send = function(key, callback) {
		callback = callback || function() {};
		lirc.irsend.send_once(remote, key, callback);
	}

};