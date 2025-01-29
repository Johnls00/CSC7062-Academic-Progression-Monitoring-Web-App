var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' }); // Express will look for 'views/pages/index.ejs'
});


module.exports = router;
