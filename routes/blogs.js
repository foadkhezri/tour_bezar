let express = require("express");
let router = express.Router();
let Blog = require("../models/blogs");

router.get("/blog", function(req, res) {
  Blog.find({})
    .sort({ created: "desc" })
    .exec(function(err, blogs) {
      if (err) {
        console.log("error occured");
      } else {
        res.render("blog", { blogs: blogs });
      }
    });
});

router.post("/blog", function(req, res) {
  let title = req.body.title;
  let author = req.body.author;
  let image = req.body.blogimage;
  let body = req.body.blogbody;
  Blog.create(
    {
      title: title,
      image: image,
      body: body,
      author: author
    },
    function(err, newPost) {
      if (err) {
        res.render("newpost");
      } else {
        res.redirect("/blog");
      }
    }
  );
});

router.get("/blog/new", adminIsLoggedIn, function(req, res) {
  res.render("newpost");
});

router.get("/blog/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("blog");
    } else {
      res.render("blogshow", { blog: foundBlog });
    }
  });
});
// edit post route
router.get("/blog/:id/edit", adminIsLoggedIn, function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.render("blog");
    } else {
      res.render("editpost", { blog: foundBlog });
    }
  });
});

// update post route
router.put("/blog/:id", function(req, res) {
  Blog.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      image: req.body.blogimage,
      body: req.body.blogbody,
      author: req.body.author
    },
    function(err, updatedBlog) {
      if (err) {
        res.redirect("/blog");
      } else {
        res.redirect("/blog/" + req.params.id);
      }
    }
  );
});

// delete post route

router.delete("/blog/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err, deletedPost) {
    if (err) {
      console.log("error in deleting post");
    } else {
      res.redirect("/blog");
    }
  });
});

router.get("/blog/search/:id", function(req, res) {
  Blog.find({ $text: { $search: req.params.id } }, function(err, foundBlogs) {
    if (err) {
      console.log("error occured");
    } else {
      res.render("blog", { blogs: foundBlogs, searchInput: req.params.id });
    }
  });
});

function adminIsLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.username == "administrator") {
    return next();
  } else {
    if (req.isAuthenticated() && req.user.username !== "administrator") {
      res.render("forbidden");
    } else {
      res.redirect("/login");
    }
  }
}

module.exports = router;
