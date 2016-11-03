// index.js

// =============================================================================
// BASE SETUP
// =============================================================================

// Call the packages we need
var express    = require('express');      // call express
var app        = express();               // define our app using express
var bodyParser = require('body-parser');  // used to retrieve post params
var morgan     = require('morgan');       // used to log received requests
var path = __dirname + '/arquicoins/views/';

// To pass original headers through NGINX
app.set('trust proxy', 'loopback');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use Morgan to log requests to the console
app.use(morgan('dev')); // 'dev' for development / 'short' for production

var port = 8083;        // set our port

// Load Controllers
var ArquitranCtrl = require('./arquicoins/arquitran/ArquitranCtrl');

// =============================================================================
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

router.get('/',function(req,res){
  res.sendFile(path + "index.html");
});

router.get('/trx/:trxId', function(req, res) {
  function callback(err, result) {
    if (err) { res.json(err); }
    else { res.json(result);  }
  }
  ArquitranCtrl.state(req.params.trxId, callback)
});
router.post('/trx', function(req, res) {
  function callback(err, result) {
    if (err) { res.json(err); }
    else {
      var status = result.status;
      var trx_id = result.header.location.replace('/transactions/', '').replace('/', '');

      // TODO --> Store transaction details !!

      res.json(result);
    }
  }
  ArquitranCtrl.init(req.body.card_number, req.body.card_cvv, req.body.first_name, req.body.last_name, req.body.currency, req.body.amount, callback)
});

// =============================================================================
// ROUTES FOR samples
// =============================================================================
var currentId = 'c8c1e4c2-fc9f-4898-8117-99af9062fd61';
router.route('/test/init')
  .get(function(req, res) {
    function callback(err, result) {
      if (err) {
          res.json(err);
      } else {
          currentId = result.header.location.replace('/transactions/', '').replace('/', '');
          res.json(result);
      }
    }
    ArquitranCtrl.init('9a4576d3-83a7-4d58-a4d2-f32f201f6e34', 123, 'Pedro', 'Saratscheff', 'CLP', 1, callback)
  })
;
router.route('/test/state')
  .get(function(req, res) {
    function callback(err, result) {
      if (err) { res.json(err); }
      else { res.json(result);  }
    }
    ArquitranCtrl.state(currentId, callback)
  })
;

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api/v1
app.use('/arquicoins', router);
// Catch 404
app.use("*",function(req,res){
  res.status(404);
  res.sendFile(path + "404.html");
});

// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
var currentDate = new Date();
currentDate.setTime(Date.now());
dateString = currentDate.toUTCString();
console.log(dateString + ' - Server running at port ' + port);
