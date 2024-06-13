const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const Like = require("../models/likeModel");
const LikeController = require("../controllers/likeController");

router.post("/like/post/:id", auth, async (req, res) => {
  try {
    const values = {
      post: req.params.id,
      author: req.user._id,
    };
    const likeController = new LikeController();
    const like = await likeController.likePost(values);
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
    const likeController = new LikeController();
    const removedLike = likeController.removeLike(values);
    res.send(removedLike);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
