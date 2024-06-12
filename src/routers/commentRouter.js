const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const Comment = require("../models/commentModel");

router.post("/comment/post/:id", auth, async(req,res) => {
    const postId = req.params.id;
    const authorId = req.user._id; 
    const content = req.body.content;
    try{
    const comment = new Comment({post: postId, author: authorId, content});
  
        await comment.save();
        res.send(comment);
    }catch(err){
        console.log(err);
        res.send(err);
    }
});

router.get("/comments/post/:id", auth, async(req,res) => {
    const postId = req.params.id;
    
    try{
        const comments = await Comment.find({post:postId});
        if(!comments){
            return res.send("no comments found for the post or incorrect post entered")
        }
        res.send(comments);
    }catch(err){
        res.send(err);
    }
    
});

router.patch("/comment/update/:id", auth, async(req,res) => {

    const cmtId = req.params.id;
    const authorId = req.user._id;
    const updates = req.body;

    try{
        const comment = await Comment.findOneAndUpdate({ _id: cmtId, author:authorId}, updates ,{new:true});
        if(!comment){ 
            return res.send("comment to be updated not found");}
        await comment.save();
        res.send(comment);
    }   catch(err){
        res.send(err);   
    }

});

router.delete("/comment/delete/:id", auth, async(req,res) => {
    const cmtId = req.params.id;
    const authorId = req.user._id;

    try{
        const comment = await Comment.findOneAndDelete({_id: cmtId, author: authorId});
        if(!comment){
            return res.send("comment to be deleted not found");
        }
        res.send(comment);
    }catch(err){
        res.send(err);
    }

});

module.exports = router