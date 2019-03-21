var express = require('express');
var router = express.Router();

const app= express();

// var usersRouter = require('../routes/users');
// var clientRouter = require('../routes/client');
// var policeRouter = require('../routes/police');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});



/* GET user page. */
router.get('/user', function(req, res, next) {
  res.render('user',{name:'User'});
});
router.get('/userform', function(req, res, next) {
  res.render('userform');
});




/* GET client page. */
router.get('/client', function(req, res, next) {
  res.render('client',{name:'Client'});
});





/* GET police page. */
router.get('/police', function(req, res, next) {
  res.render('police',{name:'Police'});
});



// app.use('/user', usersRouter);
// app.use('/client', clientRouter);
// app.use('/police', policeRouter);
module.exports = router;
