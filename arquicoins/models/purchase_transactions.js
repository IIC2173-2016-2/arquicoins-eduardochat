const cassandra = require('express-cassandra');
var serviceCassandra = require('../services/cassandra');

function connect(callback) {
    var models = serviceCassandra.createClient();

    models.connect(function (err) {
        if (err) throw err;

        var PurchaseModel = models.loadSchema('purchase_transactions', {
            fields:{
                purchase_transactions_id: "int",
                purchase_transactions_server_id: "text",
                purchase_transactions_user_id: "text",
                purchase_transactions_amount: "int",
                purchase_transactions_created_at: "timestamp"
            },
            key:["purchase_transactions_id"]
        }, function(err){
            //the table in cassandra is now created
            //the models.instance.Person or UserModel can now be used to do operations
            // console.log(models.instance.Users);
            // console.log(models.instance.Users === UserModel);
            callback(PurchaseModel);
        });
    });
}

function save(hash, callback){
  var models = serviceCassandra.createClient();
  var txs = new models.instance.purchase_transactions(hash);

  txs.save(callback);
}

module.exports = {
    connect: connect
};
