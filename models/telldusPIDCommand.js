module.exports = function() {
	var publ        = this,
		priv        = {},

		sensors     = require(process.cwd() + '/facades/sensors.js'),
		TelldusPID  = require(process.cwd() + '/models/telldusPIDProcess.js'),

		processes   = {};

	publ.send = function(id, state, sensor, target, callback) {
		callback = callback || function() {};

		var process;

		if (processes.hasOwnProperty(id) === false) {
			processes[id] = new TelldusPID(id, sensor);
		}

		process = processes[id];

		process.setEnabled(state === 'on');
		process.setTarget(target);

		callback();
	};

	priv.update = function() {
		var id, process;
		for (id in processes) {
			if (processes.hasOwnProperty(id)) {
				process = processes[id];

				process.update();
			}
		}
	};

	sensors.addListener(priv.update);
};