import Like from "../models/likeModel";
import Post from "../models/postModel";

export const likePost = async (values) => {
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
};

export const removeLike = async (values) => {
  try {
    const removedLike = await Like.findOneAndDelete(values);
    if (!removedLike) {
      throw new Error("the post has not been liked before");
    }
    return removedLike;
  } catch (err) {
    throw err;
  }
};
