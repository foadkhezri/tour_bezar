let express = require("express");
let router = express.Router();
let Tour = require("../models/tours");

router.get("/campgrounds", function(req, res) {
  Tour.find({})
    .sort({ created: "desc" })
    .exec(function(err, foundTours) {
      if (err) {
        console.log("error occured");
      } else {
        res.render("tours", { campgrounds: foundTours });
      }
    });
});
// creating new tours
router.post("/campgrounds", isLoggedIn, function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newTour = {
    name: name,
    image: image,
    description: desc,
    author: author
  };
  Tour.create(newTour, function(err, newlyCreatedTour) {
    if (err) {
      console.log("error occured");
    } else {
      console.log(newlyCreatedTour);
      res.redirect("/campgrounds");
    }
  });
});
// new tour route
router.get("/campgrounds/new", isLoggedIn, function(req, res) {
  res.render("new");
});

router.get("/campgrounds/:id", function(req, res) {
  Tour.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundTour) {
      if (err) {
        res.redirect("tours");
      } else {
        if (req.isAuthenticated()) {
          if (foundTour.author.id.equals(req.user._id)) {
            res.render("show", { tour: foundTour, authorized: true });
          } else {
            res.render("show", { tour: foundTour, authorized: false });
          }
        } else {
          res.render("show", { tour: foundTour, authorized: false });
        }
      }
    });
});

// edit tour route
router.get("/campgrounds/:id/edit", function(req, res) {
  if (req.isAuthenticated()) {
    Tour.findById(req.params.id, function(err, foundTour) {
      if (err) {
        res.render("tours");
      } else {
        if (foundTour.author.id.equals(req.user._id)) {
          res.render("edittour", { tour: foundTour });
        } else {
          res.render("forbidden");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

// update route route
router.put("/campgrounds/:id", function(req, res) {
  if (req.isAuthenticated()) {
    Tour.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        image: req.body.tourimage,
        description: req.body.tourdesc,
        author: {
          id: req.user._id,
          username: req.user.username
        }
      },
      function(err, updatedTour) {
        if (err) {
          res.render("error");
        } else {
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});

// delete post route

router.delete("/campgrounds/:id", function(req, res) {
  if (req.isAuthenticated()) {
    Tour.findByIdAndRemove(req.params.id, function(err, deletedTour) {
      if (err) {
        console.log("error in deleting tour");
      } else {
        res.redirect("/campgrounds");
      }
    });
  } else {
    res.redirect("/login");
  }
});

// search tour route

router.get("/campgrounds/search/:id", function(req, res) {
  Tour.find({ $text: { $search: req.params.id } }, function(err, foundTours) {
    if (err) {
      console.log("error occured");
    } else {
      res.render("tours", {
        campgrounds: foundTours,
        searchInput: req.params.id
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "لطفا ابتدا وارد شوید");
  res.redirect("/login");
}

module.exports = router;
