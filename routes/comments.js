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
router.get("/campgrounds/:id/comments/:comment_id/edit", function(req, res) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("/campgrounds/" + req.params.id);
      } else {
        console.log(foundComment.author);
        console.log(req.user._id);
        if (
          foundComment.author === req.user.username ||
          req.user.username === "administrator"
        ) {
          res.render("editcomment", {
            tour_id: req.params.id,
            comment: foundComment
          });
        } else {
          res.render("forbidden");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.put("/campgrounds/:id/comments/:comment_id", function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      res.render("error");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// delete comment route
router.delete("/campgrounds/:id/comments/:comment_id", function(req, res) {
  if (req.isAuthenticated()) {
    Comment.findByIdAndRemove(req.params.comment_id, function(
      err,
      deletedComment
    ) {
      if (err) {
        console.log("error in deleting tour");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  } else {
    res.redirect("/login");
  }
});

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
