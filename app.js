var express         = require('express'),
	consolidate     = require('consolidate'),
	app             = express(),
	
	config          = require(process.cwd() + '/config.js'),

	temperatures    = require(process.cwd() + '/facades/temperatures.js'),

	dataLogger      = require(process.cwd() + '/controllers/dataLogger.js'),
	start           = require(process.cwd() + '/controllers/start'),
	ac              = require(process.cwd() + '/controllers/ac');

temperatures
	.registerSensor(config.sensors.outside, 'outside')
	.registerSensor(config.sensors.inside,  'inside');

dataLogger.start();

app.use(express.bodyParser());

//Set view engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//controllers
app.get('/',            start.index);
app.post('/ac/sleep',   ac.sleep);
app.post('/ac/wakeup',  ac.wakeup);

app.use(express.static(__dirname + '/public'));

app.listen(config.listenPort);
console.log('We are up and running on port ' + config.listenPort);

