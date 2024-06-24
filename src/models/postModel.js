const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const postSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
    },
    title: {
      type: String,
    },
    picture: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
