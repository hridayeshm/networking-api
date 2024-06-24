const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const Like = require("../models/likeModel");
const EventEmitter = require('events');
const postEmitter = new EventEmitter();

class PostController {
  constructor(){
    postEmitter.on('postDeleted', this.postDeletionHandler.bind(this));
  }
  
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
      const where = {
//suggested by dai, CHECK LATER //update post doesnt work as of now
      };
      const post = await Post.findOneAndUpdate(where, {$set: updates}, { new: true });

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
      postEmitter.emit('postDeleted', post._id);
     
      return post;
    } catch (err) {
      throw err;
    }
  }

  async postDeletionHandler(postId) {
    try {
     
      const deletedComments = await Comment.deleteMany({ post: postId });

      const deletedLikes = await Like.deleteMany({ post: postId });

      if(deletedComments && deletedLikes){
        console.log("likes and comments associated to the post also removed");
      }
    
    } catch (err) {
      throw new Error("comments and likes associated with the post could not be removed");
    }
  }
}
module.exports = PostController;
