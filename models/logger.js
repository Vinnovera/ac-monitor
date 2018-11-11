module.exports = function(id) {
  var publ = this,
    priv = {},
    config = require(process.cwd() + "/config.js"),
    email = config.pushdataCredentials.email,
    apiKey = config.pushdataCredentials.apiKey,
    request = require("request");

  publ.log = function(data, callback) {
    callback = callback || function() {};

    var datastreams = [];

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        request.post(
          "https://pushdata.io/" +
            email +
            "/" +
            data[key].logName +
            "/" +
            data[key].value +
            "?apiKey=" +
            apiKey
        );
      }
    }

    callback();
  };
};
