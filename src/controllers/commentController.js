const Comment = require("../models/commentModel");

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
}

module.exports = CommentController;
