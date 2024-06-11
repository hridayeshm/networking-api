const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const auth = require("../middlewares/auth");

router.post("/user/post", auth, async (req, res) => {
    const { title, description } = req.body;
    const ownerId = req.user._id;
  
    try {
      const post = new Post({ title, description, owner: ownerId });
      await post.save();
  
      res.send(post);
    } catch (err) {
      console.log(err);
    }
  });
  
  router.get("/user/post/all", auth, async (req, res) => {
    try {
      const post = await Post.find({ owner: req.user._id });
  
      if (!post) {
        return res.send("post not found");
      }
  
      res.send(post);
    } catch (err) {
      res.send(err);
    }
  });
  
  router.get("/user/post/:id", auth, async(req,res) => {
    const postId = req.params.id;
    const ownerId = req.user._id;
    try{
      const post = await Post.findOne({_id: postId, owner: ownerId});
  
      if(!post){
        return res.send("post not found");
      }
      res.send(post);
    }catch(err){
      res.send(err);
    }
  });
  
  router.patch("/user/post/:id", auth, async (req, res) => {
    const postId = req.params.id;
    const updates = req.body;
    const ownerId = req.user._id;

    try {
      const post = await Post.findOneAndUpdate(
        { _id: postId, owner: ownerId },
        updates,
        { new: true }
      );
  
      if (!post) {
        return res.send("post to be updated not found");
      }
      res.send(post);
    } catch (err) {
      res.send(err);
    }
  });
  
  router.delete("/user/post/:id", auth, async (req, res) => {
    const postId = req.params.id;
    const ownerId = req.user._id;
    try{
      const post = await Post.findOneAndDelete({ _id: postId, owner: ownerId });
      if(!post){
        return res.send("post to be deleted not found");
      }
  
      res.send(post);
    }catch(err){
      res.send(err);
    }
  });

  module.exports = router;