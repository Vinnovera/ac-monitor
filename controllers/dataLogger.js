module.exports = new function() {
	var publ    = this,
		priv    = {},

        config          = require(process.cwd() + '/config.js'),

		fs              = require('fs'),
		moment          = require('moment'),
		temperatures    = require(process.cwd() + '/facades/temperatures.js'),
		Logger          = require(process.cwd() + '/models/logger.js'),
		Mailer          = require(process.cwd() + '/models/mailer.js'),
		logger          = new Logger,
		mailer          = new Mailer,

		interval        = config.pollIntervall,
		timer           = null,

		alarmSubject    = config.texts.alarmSubject,
		alarmMessage    = config.texts.alarmMessage,
		
		alarmEmails     = config.alarms.emailRecipients.join(','),
		alarmFrom       = config.alarms.emailFrom,
		alarms          = config.alarms.steps,
		lastAlarm       = 0,
		
		handlebars      = require('handlebars'),
		mailTemplate    = handlebars.compile(alarmMessage);


	publ.start = function() {
		if (timer) {
			clearInterval(timer);
		}

		timer = setInterval(function() {
				temperatures.getCurrent(function(temperatures) {
					priv.log(temperatures);
					priv.checkAlarms(temperatures);
				})
		}, interval)
	};

	priv.log = function(temperatures) {
		var now = moment();
		logger.log({
			date:       now.format('YYYY-MM-DD HH.mm.ss'),
			inside:     temperatures.inside,
			outside:    temperatures.outside
		});
	};

	priv.checkAlarms = function(temperatures) {
		var temperature = temperatures.inside;

		alarms.forEach(function(alarm) {
			if (alarm > temperature && alarm < lastAlarm) {
				// alarm is below last alarm
				priv.mail({
					below: true,
					alarm: alarm,
					temperature: temperature.toFixed(1)
				});

				lastAlarm = temperature;
			}
			else if (alarm < temperature && alarm > lastAlarm) {
				// alarm is above last alarm
				priv.mail({
					above: true,
					alarm: alarm,
					temperature: temperature.toFixed(1)
				});

				lastAlarm = temperature;
			}
		});
	};

	priv.mail = function(data) {
		mailer.send({
            from:       alarmFrom,
			to:         alarmEmails,
			subject:    alarmSubject,
			html:       mailTemplate(data)
		});
	};
}