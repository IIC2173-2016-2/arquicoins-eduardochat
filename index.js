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
  req.cookies["access-token"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIl9pZCI6IjU4MWIzNWQzNWE5MGRlMTEyZDU4MzAwNyIsIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7Il9fdiI6ImluaXQiLCJfaWQiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwidXNlcm5hbWUiOiJpbml0IiwiY3ZzIjoibW9kaWZ5IiwiY2FyZG51bWJlciI6Im1vZGlmeSIsImFjY291bnR0eXBlIjoiaW5pdCIsImJsb29kdHlwZSI6ImluaXQiLCJhZGRyZXNzIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsIm5hbWUiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJfX3YiOnRydWUsIl9pZCI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsInVzZXJuYW1lIjp0cnVlLCJhY2NvdW50dHlwZSI6dHJ1ZSwiYmxvb2R0eXBlIjp0cnVlLCJhZGRyZXNzIjp0cnVlLCJlbWFpbCI6dHJ1ZSwibmFtZSI6dHJ1ZX0sIm1vZGlmeSI6eyJjYXJkbnVtYmVyIjp0cnVlLCJjdnMiOnRydWV9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiX192IjowLCJfaWQiOiI1ODFiMzVkMzVhOTBkZTExMmQ1ODMwMDciLCJwYXNzd29yZCI6IiQyYSQxMCRMN3VNajRZZG9vcC5nYzRQWjR1bEVPUzIwY004eWVEUzcvc1dpR3puNEdpbjVUbENzUTBRaSIsInVzZXJuYW1lIjoiYmJiIiwiYWNjb3VudHR5cGUiOiJiYmIiLCJibG9vZHR5cGUiOiJiIiwiYWRkcmVzcyI6ImJiYiIsImVtYWlsIjoiYmJiQGJiYi5jbCIsIm5hbWUiOiJiYmIifSwiX3ByZXMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W251bGwsbnVsbF0sIiRfX29yaWdpbmFsX3ZhbGlkYXRlIjpbbnVsbF0sIiRfX29yaWdpbmFsX3JlbW92ZSI6W251bGxdfSwiX3Bvc3RzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W10sIiRfX29yaWdpbmFsX3JlbW92ZSI6W119LCJpYXQiOjE0Nzg5NzU1MDMsImV4cCI6MTQ3OTA2MTkwM30.7Jqe_UswQvx_PZaO8Uz7n5beZHXvyaTqb5RIOPy5jGQ"
  try {
    req.decoded = jwt.verify(req.cookies["access-token"], process.env.JWT_SECRET);
    next();
  } catch(err) {
    res.redirect(302, '/users/login');
  }
});

// ==========================Arquicoins Cassandra===============================
var Arquicoins = require('./arquicoins/arquicoins/arquicoinsCtrl.js');

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
    if (err) { res.json(err); }
    else { res.json(result);  }
  }
  Arquicoins.buyArquicoins(req.decoded._doc.username, req.body.amount, callback);
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
