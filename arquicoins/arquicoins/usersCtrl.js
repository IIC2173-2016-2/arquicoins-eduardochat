var User = require('../models/users');

function getPaymentInfo(username, callback) {

    User.connect(function (Users) {

        Users.findOne({users_username: username}, function (err, user) {
            if (err) {
                callback(err, {});
            } else if (user) {
                var paymentInfo = {
                    accountType: user.users_account_type,
                    creditNumber: user.users_credit_number,
                    csvNumber: user.users_csv_number
                };
                callback(null, paymentInfo);
            } else {
                callback(null, {});
            }
        });
    });
}

function updatePaymentInfo(username, paymentInfo, callback) {
    User.connect(function (Users) {

        Users.findOne({users_username: username}, function (err, user) {
            if (err) {
                callback(err, {});
            } else if (user) {
                user.users_account_type = paymentInfo.accountType;
                user.users_credit_number = paymentInfo.creditNumber;
                user.users_csv_number = parseInt(paymentInfo.csvNumber);
                user.users_updated_at = Date.now();

                user.save(function(saveErr){
                   if(saveErr){
                       callback(saveErr, {});
                   } else {
                       callback(null, {})
                   }
                });

            } else {
                callback({error: 'User not found'}, {});
            }
        });
    });
}

module.exports = {
    getPaymentInfo: getPaymentInfo,
    updatePaymentInfo: updatePaymentInfo
};