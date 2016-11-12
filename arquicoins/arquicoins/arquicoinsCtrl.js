var config = require('../../config.js');
var request = require('superagent');

var User = require('../models/users');

function getArquicoins(username, callback) {
    User.connect(function(Users) {
        // error, amount
        const Long = require('cassandra-driver').types.Long;

        Users.findOne({users_id: "10"}, function(err, user){
            callback(null, {'amount': user.users_arquicoins });
        });
    });
}

module.exports = {
    getArquicoins: getArquicoins
};
