// ==========================================================
// import packages
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user");
let commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/auth"),
  blogRoutes = require("./routes/blogs"),
  notFoundRoute = require("./routes/404");

// ===========================================================
// mongoose configuration
mongoose.connect("mongodb://localhost:27017/tour_bezar", {
  useNewUrlParser: true
});
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
// app configuration
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// passport configuration
app.use(
  require("express-session")({
    secret: "I'll be fine one day",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.adminError = false;
  res.locals.usernameTakenError = false;
  res.locals.alreadyLoggedIn = false;
  next();
});

app.use(commentRoutes);
app.use(authRoutes);
app.use(blogRoutes);
app.use(campgroundRoutes);
app.use(notFoundRoute);

// =============================================================
// configuring the server

app.listen("3000", function() {
  console.log("tour bezar server has started...");
});
