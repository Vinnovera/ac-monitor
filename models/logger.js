module.exports = function(id) {
	var publ    = this,
		priv    = {},

        config  = require(process.cwd() + '/config.js'),

		Spreadsheet = require('google-spreadsheet'),
		dataSheet   = new Spreadsheet(config.logSpreadsheet),

        username    = config.googleCredentials.username,
		password    = config.googleCredentials.password,
		isLoggedIn  = false,

		maxEntries  = config.maxLogEntries;

	publ.log = function(data, callback) {
	    callback = callback || function() {};
	    
		priv.logIn(function() {
			dataSheet.getInfo( function( err, sheetInfo ){
				if(err)console.log(err);
				if(typeof sheetInfo.worksheets[1] !== 'undefined') {
					sheetInfo.worksheets[1].addRow({
						date:     data.date,
						inside:   data.inside.toString().replace('.',   config.logDecimalPoint),
						outside:  data.outside.toString().replace('.',  config.logDecimalPoint)
					});

					if (sheetInfo.worksheets[1].rowCount > maxEntries) {
						// Clean up old entries
						sheetInfo.worksheets[1].getRows({},
							{
								'start-index': 1,
								'max-results': sheetInfo.worksheets[1].rowCount - maxEntries
                            },
							function(err, rows) {
								for (var i in rows) {
									rows[i].del();
								}
							}
						);
					}
					
					callback();
				}
			});
		});
	};

	priv.logIn = function(callback) {
		callback = callback || function () {};
		if(!isLoggedIn) {
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