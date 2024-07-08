import express from 'express';
import auth from "../middlewares/auth.js";
const router = express.Router();

import {likePost, removeLike} from "../controllers/likeController";

router.post("/like/post/:id", auth, async (req, res) => {
  try {
    const values = {
      post: req.params.id,
      author: req.user._id,
    };
 
    const like = await likePost(values);
    res.send(like);
  } catch (err) {
    res.send(err);
  }
});

router.delete("/unlike/post/:id", auth, async (req, res) => {
  try {
    const values = {
      _id: req.params.id,
      author: req.user._id,
    };
   
    const removedLike = await removeLike(values);
    res.send(removedLike);
  } catch (err) {
    res.send(err);
  }
});

export default router;
