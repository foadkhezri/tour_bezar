let mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  author: String,
  created: { type: Date, default: Date.now }
});
blogSchema.index({ "$**": "text" });
module.exports = mongoose.model("Blog", blogSchema);
