const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const Comment = require("../models/commentModel");
const CommentController = require("../controllers/commentController");

router.post("/comment/post/:id", auth, async (req, res) => {
  try {
    const values = {
      post: req.params.id,
      author: req.user._id,
      content: req.body.content,
    };
    const commentController = new CommentController();
    const comment = await commentController.addComment(values);
    res.send(comment);
  } catch (err) {
    res.send(err);
  }
});

router.get("/comments/post/:id", auth, async (req, res) => {
  try {
    const values = {
      post: req.params.id,
    };
    const commentController = new CommentController();
    const comments = await commentController.viewComments(values);
    res.send(comments);
  } catch (err) {}
});

router.patch("/comment/update/:id", auth, async (req, res) => {
  try {
    const values = {
      post: req.params.id,
      author: req.user._id,
      content: req.body.content,
    };

    const commentController = new CommentController();
    const updatedComment = await commentController.updateComment(values);
    res.send(updatedComment);
  } catch (err) {
    res.send(err.message);
  }
});

router.delete("/comment/delete/:id", auth, async (req, res) => {
  try {
    const values = {
      _id: req.params.id,
      author: req.user._id,
    };
    const commentController = new CommentController();
    const deletedComment = await commentController.deleteComment(values);
    res.send(deletedComment);
  } catch (err) {
    res.send(err.message);
  }
});

router.delete("/:postID/comment/delete/:id", auth, async(req, res) => {
  try{
    const postID = req.params.postID;
    const commentID = req.params.id;
    const ownerID = req.user._id;
   
    const commentController = new CommentController();
    const deletedComment = await commentController.deleteCommentByPostOwner(postID, commentID, ownerID);
    res.send(deletedComment); 
  }catch(err){
    res.send(err.message);
  }
});

module.exports = router;
