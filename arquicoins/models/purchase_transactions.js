const cassandra = require('express-cassandra');
const serviceCassandra = require('../services/cassandra');

function connect(callback) {
    var models = serviceCassandra.createClient();

    models.connect(function (err) {
        if (err) throw err;

        var PurchaseModel = models.loadSchema('purchase_transactions', {
            fields:{
                purchase_transactions_id: "text",
                purchase_transactions_user_id: "text",
                purchase_transactions_amount: "int",
                purchase_transactions_created_at: "timestamp"
            },
            key:["purchase_transactions_id"]
        }, function(err){
            callback(PurchaseModel, models);
        });
    });
}

module.exports = {
    connect: connect
};
