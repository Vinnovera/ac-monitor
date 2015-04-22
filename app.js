var express         = require('express'),
	consolidate     = require('consolidate'),
	app             = express(),
	
	config          = require(process.cwd() + '/config.js'),

	sensors         = require(process.cwd() + '/facades/sensors.js'),

	dataLogger      = require(process.cwd() + '/controllers/dataLogger.js'),
	start           = require(process.cwd() + '/controllers/start'),
	command         = require(process.cwd() + '/controllers/command');

dataLogger.start();

sensors.addSensors(config.sensors);
sensors.start();

app.use(express.bodyParser());

//Set view engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//controllers
app.get('/',                    start.index);
app.get('/command/ir',          command.ir);
app.get('/command/telldus',     command.telldus);
app.get('/command/telldusPID',  command.telldusPID);

app.use(express.static(__dirname + '/public'));

app.listen(config.listenPort);
console.log('We are up and running on port ' + config.listenPort);

