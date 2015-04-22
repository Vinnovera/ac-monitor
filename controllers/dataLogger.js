module.exports = new function() {
	var publ    = this,
		priv    = {},

		config          = require(process.cwd() + '/config.js'),

		sensors         = require(process.cwd() + '/facades/sensors.js'),
		logger          = new (require(process.cwd() + '/models/logger.js')),
		mailer          = new (require(process.cwd() + '/models/mailer.js')),

		alarmSubject    = config.texts.alarmSubject,
		alarmMessage    = config.texts.alarmMessage,

		alarmSensor     = config.alarms.sensor,
		alarmEmails     = config.alarms.emailRecipients.join(','),
		alarmFrom       = config.alarms.emailFrom,
		alarms          = config.alarms.steps,
		lastAlarm       = null,
		
		handlebars      = require('handlebars'),
		mailTemplate    = handlebars.compile(alarmMessage);

	publ.start = function() {
		sensors.addListener(function(temperatures) {
			priv.log(temperatures);
			priv.checkAlarms(temperatures);
		});
	};

	priv.log = function(temperatures, callback) {
		callback = callback || function() {};

		logger.log(temperatures, callback);
	};

	priv.checkAlarms = function(temperatures) {
		var temperature = temperatures[alarmSensor];

		if (typeof temperature === 'number') {
			if (lastAlarm === null) lastAlarm = temperature;

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
		}
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