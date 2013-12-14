module.exports = new function() {
	var publ    = this,
		priv    = {},

		Ac      = require(process.cwd() + '/models/ac.js'),
		ac      = new Ac;

	publ.sleep = function(req, res) {
		ac.sleep(function() { res.end() });
	};

	publ.wakeup = function(req, res) {
		ac.wakeup(function() { res.end() })
	};
}