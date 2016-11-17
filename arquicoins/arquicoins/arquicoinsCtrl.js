var User = require('../models/users');
var PurchaseTransaction = require('../models/purchase_transactions');
var GiftTransaction = require('../models/gift_transactions');
var Arquitran = require('../arquitran/arquitranCtrl');

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

function buyArquicoins(username, firstname, lastname, amount, callback) {
    const buyAmount = parseInt(amount);
    User.connect(function (Users) {

        Users.findOne({users_username: username}, function (err, user) {

            if(user.users_credit_number && user.users_csv_number) {
                //TODO Asegurar parse de amount
                // Ocupar alquitranCtrl para realizar compra
                Arquitran.init(user.users_credit_number, user.users_csv_number, firstname, lastname, 'CLP', buyAmount, function(arquitranError, result){
                    if(arquitranError) {
                        callback(arquitranError, {});
                    } else {
                        const trxId = result.header.location.replace('/transactions/', '').replace('/', '');
                        var hash = {
                            purchase_transactions_id: trxId,
                            purchase_transactions_user_id: user.users_id,
                            purchase_transactions_amount: buyAmount,
                            purchase_transactions_created_at: Date.now()
                        };


                        PurchaseTransaction.connect(function (PurchaseTransactions) {
                            var trx = new PurchaseTransactions(hash);
                            trx.save(function (saveErr) {
                                if (saveErr) {
                                    callback(saveErr, {'amount': user.users_arquicoins});
                                } else {
                                    user.users_arquicoins = user.users_arquicoins + buyAmount;
                                    user.users_updated_at = Date.now();
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
                    }

                });


            } else {
                callback('Falta información de pago', {});
            }

        });
    });

}

function transferArquicoins(username, toUsername, amount, callback) {
    const transAmount = parseInt(amount);
    User.connect(function (Users) {

        Users.findOne({users_username: toUsername}, function (err, toUser) {
            if(!toUser) {
                callback('No existe usuario objetivo', {});
            } else {
                Users.findOne({users_username: username}, function(err, user){
                    if(!user) {
                        callback('No existe usuario actual', {});
                    } else if (user.users_arquicoins < transAmount) {
                        callback('Usuario activo no tiene suficientes fondos.', {});
                    } else {
                        GiftTransaction.connect(function (GiftTransactions, models) {

                            var trxData = {
                                gift_transactions_uid: models.uuid(),
                                gift_transactions_origin_user_id: user.users_id,
                                gift_transactions_end_user_id: toUser.users_id,
                                gift_transactions_amount: transAmount,
                                gift_transactions_created_at: Date.now()
                            };

                            var trx = new GiftTransactions(trxData);
                            trx.save(function (saveErr) {
                                if (saveErr) {
                                    callback(saveErr, {});
                                } else {
                                    toUser.users_arquicoins = toUser.users_arquicoins + transAmount;
                                    toUser.users_updated_at = Date.now();
                                    toUser.save(function (toUserSaveErr) {
                                        if (toUserSaveErr) {
                                            callback(toUserSaveErr, {});
                                        } else {
                                            user.users_arquicoins = user.users_arquicoins - transAmount;
                                            user.users_updated_at = Date.now();
                                            user.save(function (userSaveErr) {
                                                if (userSaveErr) {
                                                    callback(userSaveErr, {});
                                                } else {
                                                    callback(null, {'amount': user.users_arquicoins});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                })
            }


        });
    });

}

module.exports = {
    getArquicoins: getArquicoins,
    buyArquicoins: buyArquicoins,
    transferArquicoins: transferArquicoins
};
