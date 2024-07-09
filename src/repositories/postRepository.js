import Post from "../models/postModel.js";
import postDeletedEvent from "../events/PostListener.js";

export const create = async (values) => {
  try {
    const post = new Post(values);

    await post.save();
    return post;
  } catch (err) {
    console.log(err);
  }
};

export const getAll = async (filter, options) => {
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

          likeCount: 1,

          "postCreator.username": 1,
          "postCreator._id": 1,

          "likes.author": 1,
          latestComments: 1, // ELIMINATED THE NEED TO LOOKUP COMMENTS
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
};

export const getById = async (filter) => {
  try {
    const post = await Post.findOne(filter);

    if (post === null) {
      throw new Error("post not found");
    }
    return post;
  } catch (err) {
    throw err;
  }
};

export const update = async (filter, updates) => {
  try {
    const post = await Post.findOneAndUpdate(
      filter,
      { $set: updates },
      { new: true }
    );
    console.log(post)
    if (!post) {
      throw new Error("post to be updated not found");
    }
    return post;
  } catch (err) {
    throw err;
  }
};

export const deletePost = async (filter) => {
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
};
