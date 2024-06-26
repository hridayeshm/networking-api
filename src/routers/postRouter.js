const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const auth = require("../middlewares/auth");
const PostController = require("../controllers/postController");
const _postController = new PostController();

router.post("/user/post", auth, async (req, res) => {
  try {
    const values = {
      title: req.body.title,
      description: req.body.description,
      owner: req.user._id,
    };
    const postController = new PostController();
    const post = await postController.createPost(values);
    res.send(post);
  } catch (err) {
    res.send(err);
  }
});

router.get("/user/post/all", auth, async (req, res) => {
  try {
    const values = { owner: req.user._id };
    const options = {
      page: parseInt(req.query.page),
      limit: parseInt(req.query.limit)
    };
    const postController = new PostController();
    const posts = await postController.getAllPosts(values, options);
    res.send(posts);
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/user/post/:id", auth, async (req, res) => {
  try {
    const values = {
      _id: req.params.id,
      owner: req.user._id,
    };

    const postController = new PostController();
    const post = await postController.getPostById(values);
    res.send(post);
  } catch (err) {
    res.send(err.message);
  }
});

router.patch("/user/post/:id", auth, async (req, res) => {
  try {
    const values = {
      _id: req.params.id,
      owner: req.user._id,
    };
    const updates = req.body;
    //const payload = {...updates};
    
    const postController = new PostController();
    const post = await postController.updatePost(values, updates);
    res.send(post);
  } catch (err) {
    res.send(err.message);
  }
});

router.delete("/user/post/:id", auth, async (req, res) => {
  try {
    const values = { _id: req.params.id, owner: req.user._id };
    const postController = new PostController();
    const post = postController.deletePost(values);
    
    res.send(post);
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/user/post1", auth, _postController.createPostNew);


module.exports = router;
