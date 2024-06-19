const Post = require("../models/postModel");

class PostController {
  async createPost(values) {
    try {
      const post = new Post(values);
      await post.save();
      return post;
    } catch (err) {
      throw err;
    }
  }
  
  //const createPostNewx = async (request, response, next) => {}
  async createPostNew(request, response, next) {
    try {
      const {_id} = request.user;
      const {title, description} = request.body;
      const newPost = {
        title,
        description,
        owner: _id
      }
      const post = new Post(newPost);
      const createdPost = await post.save();
      return response.status(200).send(createdPost);
    } catch (err) {
      throw err;
    }
  }

  async getAllPosts(values) {
    try {
      const post = await Post.find(values);
      if (!post || post.length === 0) {
        throw new Error("no posts found for this user");
      }
      return post;
    } catch (err) {
      throw err;
    }
  }

  async getPostById(values) {
    try {
      const post = await Post.findOne(values);

      if (post === null) {
        throw new Error("post not found");
      }
      return post;
    } catch (err) {
      throw err;
    }
  }

  async updatePost(values, updates) {
    try {
      const post = await Post.findOneAndUpdate(values, updates, { new: true });

      if (!post) {
        throw new Error("post to be updated not found");
      }
      return post;
    } catch (err) {
      throw err;
    }
  }

  async deletePost(values) {
    try {
      const post = await Post.findOneAndDelete(values);
      if (!post) {
        throw new Error("post to be deleted not found");
      }
      return post;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = PostController;
