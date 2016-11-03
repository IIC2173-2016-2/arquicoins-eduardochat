var config = require('../../config.js');
var request = require('superagent');

function getArquicoins(username, callback) {
    callback(null, {'amount': 123}); // error, amount
}

/*
var url = config.transactions_url + id + '?application_token=' + config.app_token;
request
  .get(url)
  .end(function(err, res){
    callback(err, res);
  })
;
*/

module.exports = {
    getArquicoins: getArquicoins
};
