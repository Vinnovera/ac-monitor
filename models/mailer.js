module.exports = function() {
	var publ    = this,
		priv    = {},

		mailer          = require('nodemailer'),

		username        = 'acmonitortuna@gmail.com',
		password        = 'tunamonitor',

		smtpTransport   = mailer.createTransport('SMTP', {
	        service: 'Gmail',
			auth: {
				user: username,
				pass: password
			}
		});

	publ.send = function(options, callback) {
		options     = options || {};
		callback    = callback || function() {};

		options.from = 'Tuna <acmonitortuna@gmail.com>';

		smtpTransport.sendMail(options, callback);
	};

};