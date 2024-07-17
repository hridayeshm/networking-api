import Post from "../models/postModel.js";
import { verifyAuthToken } from "../service/authService.js";
import { viewComments } from "../service/commentService.js";
import { createPost } from "../service/postService.js";
import { loginUser, registerUser, showFeed, verifyUser } from "../service/userService.js";

const resolvers = {
  Query: {
    async posts(parent, args, context, info) {
      try {
        const foundPosts = await Post.aggregate([
          { $match: {} },
          {
            $lookup: {
              from: "users",
              localField: "owner.id",
              foreignField: "_id",
              as: "postCreator",
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
            $sort: {
              _id: 1,
            },
          },
        ]);
        console.log(foundPosts);
        return foundPosts;
      } catch (err) {
        throw err;
      }
    },

    async post(parent, args, context, info) {
      const foundPost = await Post.findById(args.id);
      console.log(foundPost, "llll");
      return foundPost;
    },

    async showFeed(parent, args, request, info){
    
      const {user} = await verifyAuthToken(request);
      const feed = await showFeed(user);
      
      return feed;
    },

    async comments(parent, args, request, info){
      const {user} = await verifyAuthToken(request);
      const comments = await viewComments(args);
      return comments;
    }
  },

  Mutation: {
    async updatePost(parent, args, context, info) {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: args.id },
        {
          $set: { title: args.data.title, description: args.data.description },
        },
        { new: true }
      );
  
      return updatedPost;
    },

    async registerUser(parent, args, context, info) {
      const registeredUser = await registerUser(args);
      return registeredUser;
    },

    async verifyUser(parent, args, context, info) {
      const verifiedUser = await verifyUser(args);
      return verifiedUser;
    },

    async loginUser(parent, args, context, info) {
  
      const loggedInUser = await loginUser(args);
      return loggedInUser;
    },

    async createPost(parent, args, request, info) {
      
      const {user} = await verifyAuthToken(request);
      const createdPost = await createPost(args, user);
      return createdPost;
    }
  },

  Comment: {
    post: async(parent, args, context, info) => {

    },
    author: async(parent, args, context, info) => {

    }
  }

};

export default resolvers;
