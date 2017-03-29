var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');
    logger = require('morgan');
    cors = require('cors'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');


mongoose.set('debug', true);

// Create global app object
var app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());

// Normal express config defaults
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('method-override')());
app.use(express.static(path.join(__dirname + 'public')));
/*
  mongoose.connect('mongodb://localhost/contactsDb', function(error){
    console.log('Mongoose state: ' + mongoose.connection.readyState);
  });
*/

mongoose.connect('mongodb://aacister:password123@ds145178.mlab.com:45178/heroku_g1ggrgzq', function(error){
  console.log('Mongoose state: ' + mongoose.connection.readyState);
});

mongoose.set('debug', true);



require('./models/Contact');
require('./models/Hobby');


app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
