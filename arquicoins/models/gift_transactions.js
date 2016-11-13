const cassandra = require('express-cassandra');
const serviceCassandra = require('../services/cassandra');

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
            callback(GiftModel);
        });
    });
}
module.exports = {
    connect: connect
};
