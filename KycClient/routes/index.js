var express = require("express");
var router = express.Router();

// var usersRouter = require('../routes/users');
// var clientRouter = require('../routes/client');
// var policeRouter = require('../routes/police');

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("home");
});

/* GET user page. */
router.get("/user", function(req, res, next) {
  res.render("user", { name: "User" });
});
router.get("/userform", function(req, res, next) {
  res.render("userform");
});
router.post("/userData", (req, res,next) => {
  const privateKey = req.body.privateKey;
  const name = req.body.name;
  const email = req.body.email;
  const dob = req.body.dob;
  const address = req.body.address;
  const mobile = req.body.mobile;
  const pincode = req.body.pincode;
  const aadhar = req.body.aadhar;
  console.log("Data sent to REST API");
  const userData = new KycClient();
  userData.addKyc(
    "Manufacturer",
    privateKey,
    name,
    email,
    dob,
    address,
    mobile,
    pincode,
    aadhar
  );
});









/* GET client page. */
router.get("/client", function(req, res, next) {
  res.render("client", { name: "Client" });
});

/* GET police page. */
router.get("/police", function(req, res, next) {
  res.render("police", { name: "Police" });
});

// app.use('/user', usersRouter);
// app.use('/client', clientRouter);
// app.use('/police', policeRouter);
module.exports = router;
