const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = new mongoose.Schema(
  {
    owner: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      username: {
        type: String,
      },
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
    commentCount: {
      type: Number,
      required: true,
      default: 0,
    },
    likeCount: {
      type: Number,
      required: true,
      default: 0,
    },
    latestComments: [
      {
        content: {
          type: String,
        },

        commentedBy: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
          username: {
            type: String,
            required: true,
          },
          profile: {
            type: String,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model("Post", postSchema);

export default Post;
