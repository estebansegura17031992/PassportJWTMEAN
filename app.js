var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require("jwt-simple");
var cfg = require("./config.js");
var index = require('./api/routes/index');
var users = require('./api/routes/usersRoute');
var USERS = require('./api/models/usersModel');
var app = express();
var auth = require("./api/middlewares/auth")(); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(auth.initialize());

app.use('/', index);
app.use('/users', auth.authenticate(),(req,res)=>{
          return res.status(200).json({
            "user":req.user.id
          });
});
app.post("/token", function(req, res) {  
  if (req.body.email && req.body.password) {
      var email = req.body.email;
      var password = req.body.password;
      var user = USERS.find(function(u) {
          return u.email === email && u.password === password;
      });
      if (user) {
          var payload = {
              id: user.id
          };
          var token = jwt.encode(payload, cfg.jwtSecret);
          return res.json({
              token: token
          });
      } else {
          return res.status(401).json({"message":"User not found"});
      }
  } else {
      return res.status(401).json({"message":"No parameters"});
  }
  return res.status(404).json({"message":"Something happens"})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
