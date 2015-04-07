module.exports = function() {
	var publ    = this,
		priv    = {},

		config  = require(process.cwd() + '/config.js'),

		lirc    = require('lirc_node'),

		remote  = config.remote;

	lirc.init();

	publ.send = function(command, callback) {
		callback = callback || function() {};
		lirc.irsend.send_once(remote, command, callback);
	}

};