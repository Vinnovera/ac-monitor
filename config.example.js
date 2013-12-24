module.exports = {
	listenPort: 8080,

	googleCredentials: {
		username: 'foo@gmail.com',
		password: 'somepassword'
	},

	remote: 'AC',
	sensors: {
		inside:  '28-000005494d43',
		outside: '28-0000052112e9'
	},
	pollIntervall:   300000, // 5 minute interval
	maxLogEntries:   2016, // 7 days at 5 minute interval
	logSpreadsheet:  '0AgcfCX32-QOidGNCUU93aUJJeFBsTHMtY01ZaXN0WGc',
	logDecimalPoint: '.', // Change this to ',' depending on your spreadsheet language setting
	logChartImage:   'https://docs.google.com/a/vinnovera.se/spreadsheet/oimg?key=0AgcfCX32-QOidGNCUU93aUJJeFBsTHMtY01ZaXN0WGc&oid=1&zx=ymirwnsp28hg',

	alarms: {
		steps:           [5, 15],
		emailFrom:       'Foo <foo@gmail.com>',
		emailRecipients: ['foo@gmail.com'],
	},

	texts: {
		title:        'A/C monitor',
		heading:      'A/C mode',
		buttonSleep:  'Sleep',
		buttonWakeUp: 'Wake up',
		inside:       'Inside',
		outside:      'Outside',
		sent:         'sent!',
		alarmSubject: 'Temperature alarm',
		alarmMessage: '<h1>Temperature alarm</h1>\n' + 
		              '<p>The inside temperature is now <strong>{{#if above}}above{{/if}}{{#if below}}below{{/if}}</strong> the <strong>{{alarm}}° alarm</strong> at <strong>{{temperature}}°</strong></p>'
	}
};