let express = require("express");
let router = express.Router();
let Tour = require("../models/tours");

router.get("/campgrounds", function(req, res) {
  Tour.find({}, function(err, tours) {
    if (err) {
      console.log("error occured");
    } else {
      res.render("tours", { campgrounds: tours });
    }
  });
});
// creating new tours
router.post("/campgrounds", function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  Tour.create(
    {
      name: name,
      image: image,
      description: desc
    },
    function(err, tour) {
      if (err) {
        console.log("error occured");
      } else {
        res.redirect("/campgrounds");
      }
    }
  );
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
        console.log(req.user);
        res.render("show", { tour: foundTour });
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
