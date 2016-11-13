var config = require('../../config.js');
var request = require('superagent');

var User = require('../models/users');
var PurchaseTransaction = require('../models/purchase_transactions');

function getArquicoins(username, callback) {

    User.connect(function (Users) {

        Users.findOne({users_username: username}, function (err, user) {
            if (err) {
                callback(err, {'amount': 0});
            } else if (user) {
                callback(null, {'amount': user.users_arquicoins});
            } else {
                callback(null, {'amount': 0});
            }
        });
    });
}

function buyArquicoins(username, amount, callback) {

    User.connect(function (Users) {

        Users.findOne({users_username: username}, function (err, user) {

            //TODO Asegurar parse de amount
            // Ocupar alquitranCtrl para realizar compra
            var hash = {
                purchase_transactions_id: "myserver",
                purchase_transactions_user_id: user.users_id,
                purchase_transactions_amount: parseInt(amount),
                purchase_transactions_created_at: Date.now()
            };


            PurchaseTransaction.connect(function (PurchaseTransactions) {
                var trx = new PurchaseTransactions(hash);
                trx.save(function (saveErr) {
                    if (saveErr) {
                        callback(saveErr, {'amount': 0});
                    } else {
                        user.users_arquicoins = user.users_arquicoins + parseInt(amount);
                        user.save(function (userSaveErr) {
                            if (userSaveErr) {
                                callback(userSaveErr, {'amount': 0});
                            } else {
                                callback(null, {'amount': user.users_arquicoins});
                            }
                        });
                    }
                });
            });
        });
    });

}

module.exports = {
    getArquicoins: getArquicoins,
    buyArquicoins: buyArquicoins
};
