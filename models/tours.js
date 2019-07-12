let mongoose = require("mongoose");

let tourSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  created: { type: Date, default: Date.now }
});

tourSchema.index({ "$**": "text" });
module.exports = mongoose.model("Tour", tourSchema);
