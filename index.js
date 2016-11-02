// index.js

// =============================================================================
// BASE SETUP
// =============================================================================

// Call the packages we need
var express    = require('express');      // call express
var app        = express();               // define our app using express
var bodyParser = require('body-parser');  // used to retrieve post params
var morgan     = require('morgan');       // used to log received requests
var path = __dirname + '/views/';

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
var ArquitranCtrl = require('./app/arquitran/ArquitranCtrl');

// =============================================================================
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.route('/')
  .get(function(req, res) {
    res.json({ 'success': true })
  })
;

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api/v1
app.use('/arquicoins', router);

// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
var currentDate = new Date();
currentDate.setTime(Date.now());
dateString = currentDate.toUTCString();
console.log(dateString + ' - Server running at port ' + port);
