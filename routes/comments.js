// comments route
let express = require("express");
let router = express.Router();
let Comment = require("../models/comments");
let Tour = require("../models/tours");

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
  Tour.findById(req.params.id, function(err, tour) {
    if (err) {
      console.log("error in finding tour");
    } else {
      Comment.create({ author: req.body.author, text: req.body.text }, function(
        err,
        comment
      ) {
        if (err) {
          console.log("error in comment");
        } else {
          tour.comments.push(comment);
          tour.save();
          res.redirect("/campgrounds/" + tour._id);
        }
      });
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
