module.exports = new function() {
	var publ    = this,
		priv    = {},

		fs              = require('fs'),
		moment          = require('moment'),
		temperatures    = require(process.cwd() + '/facades/temperatures.js'),
		Logger          = require(process.cwd() + '/models/logger.js'),
		logger          = new Logger,
		Mailer          = require(process.cwd() + '/models/mailer.js'),
		mailer          = new Mailer,
		handlebars      = require('handlebars'),

		mailTemplate    = handlebars.compile(fs.readFileSync(process.cwd() + '/views/alarmMail.html', 'utf8')),

		interval        = 300000, // 5 minute interval
		timer           = null,

		alarmSubject    = 'Temperaturalarm - Tuna',
		alarmEmails     = ['jakob@vinnovera.se'],
		alarms          = [5,15,21.5],
		lastAlarm       = 0;


	publ.start = function() {
		if (timer) {
			clearInterval(timer);
		}

		timer = setInterval(function() {
				temperatures.getCurrent(function(temperatures) {
					console.log(temperatures.inside);
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
			to:         alarmEmails.join(','),
			subject:    alarmSubject,
			html:       mailTemplate(data)
		});
	};
}