const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

class CommentController {
  async addComment(values) {
    try {
      const comment = new Comment(values);
      await comment.save();
      return comment;
    } catch (err) {
      throw err;
    }
  }

  async viewComments(values) {
    try {
      const comments = await Comment.find(values);
      if (!comments) {
        throw new Error("no comments found for the post");
      }
      return comments;
    } catch (err) {
      throw err;
    }
  }

  async updateComment(values) {
    try {
      const updatedComment = await Comment.findOneAndUpdate(values, {
        new: true,
      });
      if (!updatedComment) {
        throw new Error("comment to be updated not found");
      }
      await updatedComment.save();
      return updatedComment;
    } catch (err) {
      throw err;
    }
  }

  async deleteComment(values) {
    try {
      const deletedComment = await Comment.findOneAndDelete(values);
      if (!deletedComment) {
        throw new Error("comment to be deleted not found");
      }
      return deletedComment;
    } catch (err) {
      throw err;
    }
  }

  async deleteCommentByPostOwner(postID, commentID, ownerID){
    try{
     const post = await Post.findOne({_id: postID, owner: ownerID});

     if(!post){
      throw new Error("post not found or you are authorized to delete this comment");
     }

     const comment = await Comment.findOneAndDelete({_id: commentID});

     if(!comment){
      throw new Error("comment not found or could not be deleted");
     }

     return comment

    }catch(err){
     throw err;
    }
  }
}

module.exports = CommentController;
