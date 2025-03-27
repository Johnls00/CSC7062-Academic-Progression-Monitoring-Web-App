const express = require('express');
const createError = require('http-errors');
const app = express(); // Initialize the Express application
const session = require('express-session');
const path = require('path');
const connection = require('./config/config'); // Your DB connection/configuration
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const bcrypt = require('bcryptjs'); // Using bcryptjs because had issues with bcrypt
const bodyParser = require('body-parser');

// Logging and JSON parsing middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using HTTPS
}));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Import routers
const authRoutes = require('./routes/auth'); // Authentication routes
const studentRoutes = require('./routes/student'); // Student-specific routes
const adminRoutes = require('./routes/admin'); // Admin-specific routes
const indexRoutes = require('./routes/index'); // Base route

// Use routers
app.use('/', indexRoutes);       // Base route
app.use('/auth', authRoutes);    // Authentication routes
app.use('/student', studentRoutes);  // Student-specific routes
app.use('/admin', adminRoutes);  // Admin-specific routes


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