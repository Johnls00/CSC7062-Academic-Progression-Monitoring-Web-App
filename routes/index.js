var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' }); 
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' }); 
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Express' }); 
});

module.exports = router;
