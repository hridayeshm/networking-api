const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const Comment = require("../models/commentModel");

router.post("/post/:id/comment", auth, async(req,res) => {
    const postId = req.params.id;
    const authorId = req.user._id; 
    const content = req.body.content;

    const comment = new Comment({post: postId, author: authorId, content});
    try{
        await comment.save();
        res.send(comment);
    }catch(err){
        res.send(err);
    }
});

router.get("/post/:id/comments", auth, async(req,res) => {
    const postId = req.params.id;
    
    try{
        const comments = await Comment.find({post:postId});
        
        res.send(comments)
    }catch(err){
        res.send(err);
    }
    
});

router.patch("/comment/:id", auth, async(req,res) => {

    const cmtId = req.params.id
//continue
})

module.exports = router