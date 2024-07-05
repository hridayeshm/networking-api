const Post = require("../models/postModel");
const User = require("../models/userModel");
const postDeletedEvent = require("../events/PostListener");

class PostRepository {
  async create(values) {
    try {
      const post = new Post(values);
      await post.save();
      return post;
    } catch (err) {
      console.log(err);
    }
  }

  async getAll(filter, options) {
    try {
      // const posts = await Post.paginate(filter, options);
      const posts = await Post.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "postCreator",
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "post",
            as: "comments",
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "post",
            as: "likes",
          },
        },

        {
          $project: {
            title: 1,
            description: 1,
            commentCount: 1,
            likeCount: 1,
            "postCreator.username": 1,
            "postCreator._id": 1,
            "comments.author": 1,
            "comments.content": 1,
            "likes.author": 1,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        { $skip: (options.page - 1) * options.limit },
        { $limit: options.limit },
      ]);
      if (!posts || posts.length === 0) {
        throw new Error("no posts found for this user");
      }
      return posts;
    } catch (err) {
      console.log(err);
    }
  }
  

  async getById(filter) {
    try {
      const post = await Post.findOne(filter);

      if (post === null) {
        throw new Error("post not found");
      }
      return post;
    } catch (err) {
      throw err;
    }
  }

  async update(filter, updates) {
    try {
      const post = await Post.findOneAndUpdate(
        filter,
        { $set: updates },
        { new: true }
      );

      if (!post) {
        throw new Error("post to be updated not found");
      }
      return post;
    } catch (err) {
      throw err;
    }
  }

  async delete(filter) {
    try {
      const post = await Post.findOneAndDelete(filter);
      if (!post) {
        throw new Error("post to be deleted not found");
      }

      postDeletedEvent(post);

      return post;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PostRepository;
