const cassandra = require('express-cassandra');
var serviceCassandra = require('../services/cassandra');

function connect(callback) {
    var models = serviceCassandra.createClient();

    models.connect(function (err) {
        if (err) throw err;

        var GiftModel = models.loadSchema('gift_transactions', {
            fields:{
                gift_transactions_id: "int",
                gift_transactions_origin_user_id: "text",
                gift_transactions_end_user_id: "text",
                gift_transactions_amount: "int",
                gift_transactions_created_at: "timestamp"
            },
            key:["gift_transactions_id"]
        }, function(err){
            //the table in cassandra is now created
            //the models.instance.Person or UserModel can now be used to do operations
            // console.log(models.instance.Users);
            // console.log(models.instance.Users === UserModel);
            callback(GiftModel);
        });
    });
}
module.exports = {
    connect: connect
};
