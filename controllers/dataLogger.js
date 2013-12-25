module.exports = new function() {
	var publ    = this,
		priv    = {},

		config          = require(process.cwd() + '/config.js'),

		fs              = require('fs'),
		moment          = require('moment'),
		temperatures    = require(process.cwd() + '/facades/temperatures.js'),
		Logger          = require(process.cwd() + '/models/logger.js'),
		Mailer          = require(process.cwd() + '/models/mailer.js'),
		Chart           = require(process.cwd() + '/models/chart.js'),
		logger          = new Logger,
		mailer          = new Mailer,
		chart           = new Chart,

		interval        = config.pollIntervall,
		timer           = null,
		
		minChartSize    = 2000,
		chartImageFile  = process.cwd() + '/public/img/chart.png',

		alarmSubject    = config.texts.alarmSubject,
		alarmMessage    = config.texts.alarmMessage,
		
		alarmEmails     = config.alarms.emailRecipients.join(','),
		alarmFrom       = config.alarms.emailFrom,
		alarms          = config.alarms.steps,
		lastAlarm       = null,
		
		handlebars      = require('handlebars'),
		mailTemplate    = handlebars.compile(alarmMessage);


	publ.start = function() {
		if (timer) {
			clearInterval(timer);
		}

		timer = setInterval(priv.getTemperatures, interval);
		priv.getTemperatures();
	};

	priv.getTemperatures = function() {
		temperatures.getCurrent(function(temperatures) {
			priv.log(temperatures, priv.updateChart);
			priv.checkAlarms(temperatures);
		})
	};

	priv.log = function(temperatures, callback) {
		callback = callback || function() {};
		
		var now = moment();
		logger.log({
			date:       now.format('YYYY-MM-DD HH.mm.ss'),
			inside:     temperatures.inside,
			outside:    temperatures.outside
		}, callback);
	};

	priv.checkAlarms = function(temperatures) {
		var temperature = temperatures.inside;

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
	};

	priv.mail = function(data) {
		mailer.send({
			from:       alarmFrom,
			to:         alarmEmails,
			subject:    alarmSubject,
			html:       mailTemplate(data)
		});
	};
	
	priv.updateChart = function() {
		chart.fetch(function(image) {
			if (image.length >= minChartSize) {
				priv.saveChart(image);
			}
		});
	};
	
	priv.saveChart = function(image) {
		fs.writeFile(chartImageFile, image, { encoding: 'binary' });
	}
}