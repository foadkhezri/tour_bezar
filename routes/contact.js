let express = require("express");
let router = express.Router();

router.get("/contact", function(req, res) {
  res.render("contact");
});

router.post("/contact", (req, res) => {
  req.flash("success", "پیام شما با موفقیت ارسال شد.");
  res.redirect("/contact");
});

module.exports = router;
