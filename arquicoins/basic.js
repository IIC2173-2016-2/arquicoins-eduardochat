const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['146.155.13.130', '146.155.13.131', '146.155.13.132'], keyspace: 'arquicoins'});
client.connect(function (err) {
  assert.ifError(err);
});

var some_user_id = 45;
var some_server = "1";
var some_amount = 300;

// Get, insert & update into users
var query_1 = "SELECT users_id, users_arquicoins FROM arquicoins.users";
client.execute(query_1, function (err, result) {
  var result = result.first();
  console.log(`User ID ${result.users_id} has ${result.users_arquicoins} arquicoins`);
});

var query_2 = 'SELECT users_id, users_arquicoins FROM arquicoins.users WHERE users_id = ?';
client.execute(query_2, [some_user_id], callback);

var query_3 = 'INSERT INTO arquicoins.users_arquicoins (users_id, users_arquicoins, users_updated_at) VALUES (?, ?, ?)';
var params = [some_user_id, some_amount, new Date().toISOString()];
client.execute(query_3, params, { prepare: true }, function (err) {
  assert.ifError(err);
});

var query_4 = 'UPDATE arquicoins.users SET users_arquicoins=? WHERE users_id=?';
client.execute(query_4, [some_amount, some_user_id], { prepare: true }, function(err) {
  assert.ifError(err);
  console.log('Row updated on the cluster');
});

// Get & insert into purchases (w/ Arquicoins API)
var query_1 = "SELECT purchase_transactions_id, purchase_transactions_server_id, purchase_transactions_user_id, purchase_transactions_amount FROM arquicoins.purchase_transactions";
client.execute(query_1, function (err, result) {
  var result = result.first();
  console.log(`Transaction ID ${result.purchase_transactions_id} was made in server ${result.purchase_transactions_server_id}, by ${purchase_transactions_user_id} for ${purchase_transactions_amount} arquicoins`);
});

var query_3 = 'INSERT INTO arquicoins.purchase_transactions (purchase_transactions_id, purchase_transactions_server_id, purchase_transactions_user_id, purchase_transactions_amount, purchase_transactions_created_at) VALUES (?, ?, ?, ?, ?)';
var params = [1, some_server , some_user_id, some_amount,  Date().toISOString()];
client.execute(query_3, params, { prepare: true }, function (err) {
  assert.ifError(err);
});

// Get & insert into gifts
var query_1 = "SELECT gift_transactions_id, gift_transactions_origin_user_id, gift_transactions_end_user_id, gift_transactions_amount FROM arquicoins.gift_transactions";
client.execute(query_1, function (err, result) {
  var result = result.first();
  console.log(`Transaction ID ${result.gift_transactions_id} was made by user ${result.gift_transactions_origin_user_id} for user ${gift_transactions_end_user_id} for ${gift_transactions_amount} arquicoins`);
});

var query_3 = 'INSERT INTO arquicoins.gift_transactions (gift_transactions_id, gift_transactions_origin_user_id, gift_transactions_end_user_id, gift_transactions_amount, gift_transactions_created_at) VALUES (?, ?, ?, ?, ?)';
var params = [1, some_user_id , some_user_id, some_amount,  Date().toISOString()];
client.execute(query_3, params, { prepare: true }, function (err) {
  assert.ifError(err);
});
