const mongoose = require("mongoose");
const { type } = require("os");

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: null,
  },
  editedAt: {
    type: Date,
    default: null
  }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
