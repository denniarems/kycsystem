var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('user');
  
  res.render('user');
});

module.exports = router;
