let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");
let Tour = require("../models/tours");

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
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
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
  if (req.body.username !== "admininstrator") {
    let newUser = new User({
      username: req.body.username,
      email: req.body.email
    });
    User.register(newUser, req.body.password, function(err, user) {
      if (err) {
        console.log(err.message);
        return res.render("register", { usernameTakenError: true });
      }
      passport.authenticate("local")(req, res, function() {
        console.log(user.email);
        req.flash(
          "success",
          req.body.username + " عزیز اکانت شما با موفقیت ساخته شد "
        );
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
  req.flash("success", "با موفقیت خارج شدید");
  res.redirect("/login");
});

// dashboard
router.get("/dashboard", isLoggedIn, function(req, res) {
  User.findById(req.user._id, function(err, foundUser) {
    if (err) {
      console.log("user not found");
    } else {
      Tour.find(
        { author: { id: foundUser._id, username: foundUser.username } },
        function(err, foundTours) {
          if (err) {
            console.log(
              "error occured in founding tours for the spicific user"
            );
          } else {
            res.render("dashboard", {
              campgrounds: foundTours,
              user: foundUser
            });
          }
        }
      );
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
