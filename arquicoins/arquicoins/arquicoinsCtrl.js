var config = require('../../config.js');
var request = require('superagent');

var User = require('../models/users');
var PurchaseTransaction = require('../models/purchase_transactions');

function getArquicoins(username, callback) {

    // TODO, implementar que se llame usuario según la variable username
    // que recibe este método

    User.connect(function(Users) {
        // error, amount
        const Long = require('cassandra-driver').types.Long;

        Users.findOne({users_username: username}, function(err, user){
            if(err) {
                callback(err, {'amount': 0 });
            } else if(user) {
                callback(null, {'amount': user.users_arquicoins });
            } else {
              callback(null, {'amount': 0 });
                              console.log("aqui");
            }
        });
    });
    // callback(null, {'amount': 10 });
}

function buyArquicoins(username, amount, callback){

  User.connect(function(Users) {
      // error, amount
      const Long = require('cassandra-driver').types.Long;

      Users.findOne({users_username: username}, function(err, user){

        // Ocupar alquitranCtrl para realizar compra
        var hash = {  purchase_transactions_id: 1,
          purchase_transactions_server_id: "myserver",
          purchase_transactions_user_id: "1213213",
          purchase_transactions_amount: amount,
          purchase_transactions_created_at: Date.now()};

        PurchaseTransaction.save(hash, function(err){
          if(err){
            // callback con error
          }
        });
      });
  });


  const Long = require('cassandra-driver').types.Long;

  Users.findOne({users_id: "1213213"}, function(err, user){
      callback(null, {'amount': user.users_arquicoins });
  });

}

module.exports = {
    getArquicoins: getArquicoins,
    buyArquicoins: buyArquicoins
};
