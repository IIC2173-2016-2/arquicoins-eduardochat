// index.js

// =============================================================================
// BASE SETUP
// =============================================================================

// Call the packages we need
var express       = require('express');      // call express
var app           = express();               // define our app using express
var bodyParser    = require('body-parser');  // used to retrieve post params
var morgan        = require('morgan');       // used to log received requests
var jwt           = require('jsonwebtoken'); // JsonWebToken for session validation
var cookieParser  = require('cookie-parser');// simple cookie parser for Express
var path          = __dirname + '/public/';  // public path

// To pass original headers through NGINX
app.set('trust proxy', 'loopback');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use cookieParser
app.use(cookieParser());

// use Morgan to log requests to the console
app.use(morgan('dev')); // 'dev' for development / 'short' for production


var port = 8083;        // set our port

// =============================================================================
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// =============================Login User Data=================================

app.use(function (req, res, next) {
  // Remover la siguient elinea cuando se vata prod
  try {
    var jwt_token = req.cookies["access-token"];
    var jwt_token = jwt_token || req.headers["access-token"];
    req.decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
    next();
  } catch(err) {
    console.log(req.headers);
    res.redirect(302, '/users/login');
  }
});

// ==========================Arquicoins Cassandra===============================
var Arquicoins = require('./arquicoins/arquicoins/arquicoinsCtrl.js');
var Users = require('./arquicoins/arquicoins/usersCtrl.js');

router.get('/data/arquicoins', function(req, res){
  function callback(err, result) {
    if (err) {
        res.status(400);
        res.json(err);
    }
    else { res.json(result);  }
  }
  Arquicoins.getArquicoins(req.decoded._doc.username, callback)
});

router.post('/data/arquicoins/buy', function(req, res){
  function callback(err, result) {
    if (err) {
        res.status(400);
        res.json(err);
    }
    else { res.json(result);  }
  }
  Arquicoins.buyArquicoins(req.decoded._doc.username, req.decoded._doc.firstname, req.decoded._doc.lastname, req.body.amount, callback);
});

router.post('/data/arquicoins/transfer', function(req, res){
    function callback(err, result) {
        if (err) {
            res.status(400);
            res.json(err);
        }
        else { res.json(result);  }
    }
    Arquicoins.transferArquicoins(req.decoded._doc.username, req.body.toUsername, req.body.amount, callback);
});

router.get('/data/paymentinfo', function(req, res){
    function callback(err, result) {
        if (err) {
            res.status(400);
            res.json(err);
        }
        else { res.json(result);  }
    }
    Users.getPaymentInfo(req.decoded._doc.username, callback)
});

router.patch('/data/paymentinfo', function(req, res){
    function callback(err, result) {
        if (err) {
            res.status(400);
            res.json(err);
        }
        else { res.json(result);  }
    }

    var paymentInfo = {
        accountType: req.body.accountType,
        creditNumber: req.body.creditNumber,
        csvNumber: req.body.csvNumber
    };
    Users.updatePaymentInfo(req.decoded._doc.username, paymentInfo, callback)
});

// ============================Arquitran TRX====================================
var Arquitran = require('./arquicoins/arquitran/arquitranCtrl');

router.get('/trx/:trxId', function(req, res) {
  function callback(err, result) {
    if (err) { res.json(err); }
    else { res.json(result);  }
  }
  Arquitran.state(req.params.trxId, callback)
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
  Arquitran.init(req.body.card_number, req.body.card_cvv, req.body.first_name, req.body.last_name, req.body.currency, req.body.amount, callback)
});

// =========================Public Folder=======================================
app.use('/arquicoins', express.static('public'));

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
    Arquitran.init('9a4576d3-83a7-4d58-a4d2-f32f201f6e34', 123, 'Pedro', 'Saratscheff', 'CLP', 1, callback)
  })
;
router.route('/test/state')
  .get(function(req, res) {
    function callback(err, result) {
      if (err) { res.json(err); }
      else { res.json(result);  }
    }
    Arquitran.state(currentId, callback)
  })
;

// =============================================================================
// Register Routes
// =============================================================================
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
