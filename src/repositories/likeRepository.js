import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";

export const likeP = async (values) => {
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

export const remove = async (values) => {
  try {
    const removedLike = await Like.findOneAndDelete(values);
    console.log(removedLike)
    await Post.findOneAndUpdate(
      { _id: values.post },
      { $inc: { likeCount: -1 } }
    );
    if (!removedLike) {
      throw new Error("the post has not been liked before");
    }
    return removedLike;
  } catch (err) {
    throw err;
  }
};
