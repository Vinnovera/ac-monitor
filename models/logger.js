module.exports = function(id) {
	var publ    = this,
		priv    = {},

		GoogleSpreadsheet   = require('google-spreadsheet'),
		dataSheet           = new GoogleSpreadsheet('0AgcfCX32-QOidGNCUU93aUJJeFBsTHMtY01ZaXN0WGc'),

		isLoggedIn  = false,

		maxEntries  = 2016; // 7 days at 5 minute interval

	publ.log = function(data) {
		priv.logIn(function() {
			dataSheet.getInfo( function( err, sheetInfo ){
				if(err)console.log(err);
				if(typeof sheetInfo.worksheets[1] !== 'undefined') {
					sheetInfo.worksheets[1].addRow({
						date:     data.date,
						inside:   data.inside.toString().replace('.',','), // Swedish spreadsheet
						outside:  data.outside.toString().replace('.',',') // Swedish spreadsheet
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
				}
			});
		});
	};

	priv.logIn = function(callback) {
		callback = callback || function () {};
		if(!isLoggedIn) {
			dataSheet.setAuth( 'acmonitortuna@gmail.com','tunamonitor', function(err){
				if (err) console.log(err);

				isLoggedIn = true;
				callback();
			});
		} else {
			callback();
		}
	}
};