import Post from "../models/postModel.js";
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
         return foundPost;
    },

    
  },
  Mutation: {
    async updatePost(parent, args, context, info){
        console.log(args)
        const updatedPost = await Post.findOneAndUpdate({_id: args.id},{
            $set: {title: args.data.title, description:args.data.description}
        },{ new: true})
        console.log(updatedPost)
        return updatedPost
    }
  }
};

export default resolvers;
