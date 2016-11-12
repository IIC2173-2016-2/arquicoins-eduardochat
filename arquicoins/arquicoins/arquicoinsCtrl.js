var config = require('../../config.js');
var request = require('superagent');

var User = require('../models/users');

function getArquicoins(username, callback) {

    // TODO, implementar que se llame usuario según la variable username
    // que recibe este método

    User.connect(function(Users) {
        // error, amount
        const Long = require('cassandra-driver').types.Long;

        Users.findOne({users_id: "10"}, function(err, user){
            callback(null, {'amount': user.users_arquicoins });
        });
    });
    // callback(null, {'amount': 10 });
}

module.exports = {
    getArquicoins: getArquicoins
};
