module.exports = function() {
	var publ    = this,
		priv    = {},

		config  = require(process.cwd() + '/config.js'),

		lirc    = require('lirc_node'),

		remote  = config.remote;

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