module.exports = function(id) {
	var publ    = this,
		priv    = {},

		config  = require(process.cwd() + '/config.js'),

		Spreadsheet     = require('google-spreadsheet'),
		dataSheet       = new Spreadsheet(config.logSpreadsheet),

		username        = config.googleCredentials.username,
		password        = config.googleCredentials.password,

		XivelyClient    = require('xively'),
		xively          = new XivelyClient(),

		apiVer          = config.xivelyCredentials.apiVer,
		apiKey          = config.xivelyCredentials.apiKey,
		feedId          = config.xivelyCredentials.feedId,

		isLoggedIn      = false,

		maxEntries      = config.maxLogEntries;

	publ.log = function(data, callback) {
		callback = callback || function() {};

		priv.logIn(function() {
			xively.feed.new(feedId, {
				data_point: {
					'version': apiVer,
					'datastreams': [
						{
							'id':               'inside',
							'current_value':    data.inside
						},
						{
							'id':               'outside',
							'current_value':    data.outside
						}

					]
				}
			});

			dataSheet.getInfo( function( err, sheetInfo ){
				if(err) console.log(err);
				
				if(typeof sheetInfo.worksheets[0] !== 'undefined') {
					sheetInfo.worksheets[0].addRow({
						date:     data.date,
						inside:   data.inside.toString().replace('.',   config.logDecimalPoint),
						outside:  data.outside.toString().replace('.',  config.logDecimalPoint)
					}, callback);

					if (sheetInfo.worksheets[0].rowCount > maxEntries) {
						// Clean up old entries
						sheetInfo.worksheets[0].getRows({},
							{
								'start-index': 1,
								'max-results': sheetInfo.worksheets[0].rowCount - maxEntries
							},
							function(err, rows) {
								for (var i in rows) {
									rows[i].del();
								}
							}
						);
					}
				}
			});
		});
	};

	priv.logIn = function(callback) {
		callback = callback || function () {};
		
		if(!isLoggedIn) {
			xively.setKey(apiKey);

			dataSheet.setAuth( username, password, function(err){
				if (err) console.log(err);

				isLoggedIn = true;
				callback();
			});
		} else {
			callback();
		}
	}
};