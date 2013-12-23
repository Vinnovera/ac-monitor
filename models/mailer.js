module.exports = function() {
	var publ    = this,
		priv    = {},

        config  = require(process.cwd() + '/config.js'),

		mailer  = require('nodemailer'),

        username    = config.googleCredentials.username,
		password    = config.googleCredentials.password,

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

		smtpTransport.sendMail(options, callback);
	};

};