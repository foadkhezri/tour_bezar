// ==========================================================
// import packages
const express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  flash = require("connect-flash"),
  User = require("./models/user"),
  commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/auth"),
  userRoutes = require("./routes/users"),
  blogRoutes = require("./routes/blogs"),
  contactRoutes = require("./routes/contact"),
  notFoundRoute = require("./routes/404"),
  port = process.env.PORT || 8080;

// ===========================================================
// mongoose configuration
// mongoose.connect("mongodb://localhost:27017/tour_bezar", {
//   useNewUrlParser: true
// });
mongoose.connect("mongodb://colt:rusty@ds055525.mongolab.com:55525/yelpcamp", {
  useNewUrlParser: true
});
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
// app configuration
app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
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
  res.locals.errorMessage = String(req.flash("error")[0]);
  res.locals.successMessage = String(req.flash("success")[0]);
  res.locals.usernameTakenError = false;
  res.locals.searchInput = "undefined";
  res.locals.alreadyLoggedIn = false;
  next();
});

app.use(commentRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(blogRoutes);
app.use(contactRoutes);
app.use(campgroundRoutes);
app.use(notFoundRoute);

// =============================================================
// configuring the server

app.listen(port, function() {
  console.log("tour bezar server has started...");
});
