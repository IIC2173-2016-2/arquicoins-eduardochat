var config = require('../../config.js');
var request = require('superagent');

function init(card_number, card_cvv, first_name, last_name, currency, amount, callback) {
    var url = config.transactions_url;
    var data = {
        "application_token": config.app_token,
        "kredit_card": {
            "card_number": card_number,
            "card_cvv": card_cvv,
            "card_holder": {
                "first_name": first_name,
                "last_name": last_name
            }
        },
        "to_charge": {
            "currency": currency,
            "amount": amount
        }
    }
    request
      .post(url)
      .send(data)
      .set('Content-Type', 'application/json')
      .end(function(err, res){
        callback(err, res);
      })
    ;
}

function state(id, callback) {
    var url = config.transactions_url + id + '?application_token=' + config.app_token;
    request
      .get(url)
      .end(function(err, res){
        callback(err, res);
      })
    ;
}

module.exports = {
    init: init,
    state: state
};
