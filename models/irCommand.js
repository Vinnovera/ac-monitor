module.exports = function(device) {
	var publ    = this,
		priv    = {},

		lirc    = require('lirc_node');

	lirc.init();

	publ.send = function(command, callback) {
		callback = callback || function() {};
		lirc.irsend.send_once(device, command, callback);
	}

};