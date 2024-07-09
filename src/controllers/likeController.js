import { likeP, remove } from "../repositories/likeRepository.js";

export const likePost = async (req, res, next) => {
  try {
    const values = {
      post: req.params.id,
      author: req.user._id,
    };
 
    const like = await likeP(values);
    res.send(like);
  } catch (err) {
    res.send(err);
  }

};

export const removeLike = async (req, res, next) => {
  try {
    const values = {
      _id: req.params.id,
      author: req.user._id,
    };
   
    const removedLike = await remove(values);
    res.send(removedLike);
  } catch (err) {
    res.send(err);
  }
 
};
