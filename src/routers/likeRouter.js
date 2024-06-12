const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const Like = require("../models/likeModel");

router.post("/like/post/:id", auth, async(req,res) => {
    const postId = req.params.id;
    const authorId = req.user._id;

    try{
        const like = new Like({post: postId, author: authorId});
        await like.save();
        res.send(like);
    }catch(err){
        res.send(err);
    }
});

router.delete("/unlike/post/:id", auth, async(req,res) => {
    const likeId = req.params.id;
   
    const authorId = req.user._id;
   
    try{
        const removedLike = await Like.findOneAndDelete({ _id: likeId, author: authorId});
   
        if(!removedLike){
            return res.send("the post has not been liked before");
        }
       
        res.send(removedLike);
    }catch(err){
        res.send(err);
    }
});

module.exports = router;