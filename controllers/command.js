module.exports = new function() {
	var publ    = this,
		priv    = {},

		ir      = new (require(process.cwd() + '/models/irCommand.js')),
		telldus = new (require(process.cwd() + '/models/telldusCommand.js'));

	publ.ir = function(req, res) {
		ir.send(req.query.command, function() { res.end() });
	};

	publ.telldus = function(req, res) {
		telldus.send(parseInt(req.query.command), req.query.state, function() { res.end() })
	};
}