const express = require('express');
const createError = require('http-errors');
const app = express(); // Initialize the Express application
const session = require('express-session');
const path = require('path');
const connection = require('./config/config'); // Your DB connection/configuration
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

// Import main routes
const routes = require('./routes');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

console.log('Views directory:', path.join(__dirname, 'views'));

// Logging and JSON parsing middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: true
}));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, providing error only in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error/error', { title: 'Error' });
});

module.exports = app;