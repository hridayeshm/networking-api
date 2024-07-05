const Like = require("../models/likeModel");
const Post = require("../models/postModel");

class LikeController {
  async likePost(values) {
    try {
      const like = new Like(values);
      await like.save();
      await Post.findOneAndUpdate(
        { _id: values.post },
        { $inc: { likeCount: 1 } }
      );
      return like;
    } catch (err) {
      throw err;
    }
  }

  async removeLike(values) {
    try {
      const removedLike = await Like.findOneAndDelete(values);
      if (!removedLike) {
        throw new Error("the post has not been liked before");
      }
      return removedLike;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = LikeController;
