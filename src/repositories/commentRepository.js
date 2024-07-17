import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";

export const add = async (values, req) => {
  try {
    const comment = new Comment(values);
    await comment.save();

    const updatedPost = await Post.findOneAndUpdate(
      { _id: comment.post },
      {
        $push: {
          latestComments: {
            $each: [
              {
                content: comment.content,
                commentedBy: {
                  id: comment.author,
                  username: req.user.username,
                  profile: req.user.profile,
                },
              },
            ],
            $position: 0,
            $slice: 2,
          },
        },
        $inc: { commentCount: 1 },
      },
      { new: true }
    );

 

    if (!updatedPost) {
      throw new Error("could not comment on the post");
    }

    return comment;
  } catch (err) {
    throw err;
  }
};

export const view = async (filter) => {
  try {
    const comments = await Comment.find(filter);
    if (!comments) {
      throw new Error("no comments found for the post");
    }
    return comments;
  } catch (err) {
    throw err;
  }
};

export const update = async (values) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: values._id, author: values.author },
      {
        content: values.content,
      },
      {
        new: true,
      }
    );

    if (!updatedComment) {
      throw new Error("comment to be updated not found");
    }
    await updatedComment.save();
    return updatedComment;
  } catch (err) {
    throw err;
  }
};

export const deleteCommentAuthor = async (values) => {
  try {
    const deletedComment = await Comment.findOneAndDelete(values);
    if (!deletedComment) {
      throw new Error("comment to be deleted not found");
    }
    return deletedComment;
  } catch (err) {
    throw err;
  }
};

export const deleteCommentPostOwner = async (postID, ownerID, commentID) => {
  try {
    const post = await Post.findOne({ _id: postID, owner: ownerID });

    if (!post) {
      throw new Error(
        "post not found or you are authorized to delete this comment"
      );
    }

    const comment = await Comment.findOneAndDelete({ _id: commentID });

    if (!comment) {
      throw new Error("comment not found or could not be deleted");
    }

    return comment;
  } catch (err) {
    throw err;
  }
};
