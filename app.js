const express = require('express');
const createError = require('http-errors');
const app = express(); // Initialize the Express application
const session = require('express-session');
const path = require('path');
const connection = require('./config/config'); // DB connection/configuration
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
    cookie: { secure: false, maxAge: 3600000 }  // Set to true if using HTTPS
}));

// Middleware to print session data for every request debugging
// This is useful for debugging purposes
// app.use((req, res, next) => {
//   console.log("Session at middleware level:", req.session);
//   next();
// });

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Import routers

const authRoutes = require('./routes/auth'); // Authentication routes
const studentRoutes = require('./routes/student'); // Student-specific routes
const adminRoutes = require('./routes/admin'); // Admin-specific routes
const notificationRoutes = require('./routes/notifications'); // notification routes
const messagesRoutes = require('./routes/messages'); // notification routes
const uploadRoutes = require('./routes/uploadHandler'); // file upload routes
const reportRoutes = require("./routes/reports"); // reports route

const indexRoutes = require('./routes/index'); // Base route

// Use routers
// Base route
app.use('/auth', authRoutes);    // Authentication routes
app.use('/student', studentRoutes);  // Student-specific routes
app.use('/admin', adminRoutes);  // Admin-specific routes
app.use('/messages', messagesRoutes); // message routes
app.use('/notifications', notificationRoutes); // notification routes
app.use('/uploadHandler', uploadRoutes); // handle file uploads
app.use('/reports', reportRoutes); // handles report generation


app.use('/', indexRoutes);    // Keep this at the bottom of routes or it will break again 


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