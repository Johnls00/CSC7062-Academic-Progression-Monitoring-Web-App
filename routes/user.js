var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('user'); // Renders 'views/user.ejs'
});

module.exports = router;