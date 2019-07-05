let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");

router.get("/", function(req, res) {
  res.render("index");
});

// Auth Routes
// =============================================================

// handling user login
router.get("/login", function(req, res) {
  if (req.user !== undefined) {
    res.render("login", { alreadyLoggedIn: true });
  } else {
    res.render("login");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// handling user sign up

router.get("/signup", function(req, res) {
  if (req.user !== undefined) {
    res.render("register", { alreadyLoggedIn: true });
  } else {
    res.render("register");
  }
});
router.post("/signup", function(req, res) {
  if (req.body.username !== "admin") {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        console.log(err.message);
        return res.render("register", { usernameTakenError: true });
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/campgrounds");
      });
    });
  } else {
    res.render("register", { adminError: true });
  }
});

// logout

router.get("/logout", function(req, res) {
  req.logOut();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// dashboard
router.get("/dashboard", isLoggedIn, function(req, res) {
  res.render("dashboard");
});

module.exports = router;
