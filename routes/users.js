let express = require("express");
let router = express.Router();
let Tour = require("../models/tours");
let User = require("../models/user");

router.get("/users/:id", isLoggedIn, function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
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
            res.render("users", {
              campgrounds: foundTours,
              user: foundUser
            });
          }
        }
      );
    }
  });
});

router.get("/users/:id/edit", function(req, res) {
  if (req.isAuthenticated()) {
    User.findById(req.user._id, function(err, foundUser) {
      if (err) {
        res.render("error");
      } else {
        res.render("edituser", { user: foundUser });
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.put("/users/:id/", isLoggedIn, function(req, res) {
  User.findByIdAndUpdate(
    req.user._id,
    {
      username: req.user.username,
      email: req.body.newemail,
      password: req.body.newpassword
    },
    function(err, updatedUser) {
      if (err) {
        res.render("error");
      } else {
        req.flash("success", "اکانت شما با موفقیت ویرایش شد");
        res.redirect("/dashboard");
      }
    }
  );
});

router.delete("/users/:id", function(req, res) {
  if (req.isAuthenticated()) {
    User.findByIdAndRemove(req.user._id, function(err, deletedUser) {
      if (err) {
        console.log("error in deleting user");
      } else {
        req.flash(
          "success",
          " حساب کاربری " + deletedUser.username + " با موفقیت حذف گردید "
        );
        res.redirect("/signup");
      }
    });
  } else {
    res.redirect("/login");
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "لطفا ابتدا وارد شوید");
  res.redirect("/login");
}

module.exports = router;
