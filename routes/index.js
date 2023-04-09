var express = require("express");
var router = express.Router();

const isAuth = require("./authMiddleware").isAuth;
const isAdmin = require("./authMiddleware").isAdmin;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/posts");
});

router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("You made it to the route.");
});

router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send("You made it to the admin route.");
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
