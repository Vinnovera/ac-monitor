module.exports = new function() {
	var publ    = this,
		priv    = {},

		config  = require(process.cwd() + '/config.js'),

		ir          = new (require(process.cwd() + '/models/irCommand.js'))(config.remote),
		telldus     = new (require(process.cwd() + '/models/telldusCommand.js')),
		telldusPID  = new (require(process.cwd() + '/models/telldusPIDCommand.js'));

	publ.ir = function(req, res) {
		ir.send(req.query.command, function() { res.end() });
	};

	publ.telldus = function(req, res) {
		telldus.send(parseInt(req.query.command), req.query.state, function() { res.end() })
	};

	publ.telldusPID = function(req, res) {
		telldusPID.send(parseInt(req.query.command), req.query.state, req.query.sensor, parseInt(req.query.target), function() { res.end() })
	};
}