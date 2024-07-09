import {
  create,
  getAll,
  getById,
  update,
  deletePost,
} from "../repositories/postRepository.js";

export const createPost = async (req, res, next) => {
  try {
    const values = {
      title: req.body.title,
      description: req.body.description,
      owner: { id: req.user._id, username: req.user.username },
    };

    const post = await create(values);

    res.send(post);
  } catch (err) {
    res.send(err);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const filter = { owner: { id: req.user._id, username: req.user.username } };
    const options = {
      page: parseInt(req.query.page),
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
    };

    const posts = await getAll(filter, options);
    res.send(posts);
  } catch (err) {
    res.send(err.message);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const filter = {
      _id: req.params.id,
      owner: { id: req.user._id, username: req.user.username },
    };

    const post = await getById(filter);
    res.send(post);
  } catch (err) {
    res.send(err.message);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const filter = {
      _id: req.params.id,
      owner: {
        id: req.user._id,
        username: req.user.username,
      },
    };
    const updates = req.body;

    const post = await update(filter, updates);
    res.send(post);
  } catch (err) {
    res.send(err.message);
  }
};

export const deletePostById = async (req, res, next) => {
  try {
    const filter = {
      _id: req.params.id,
      owner: { id: req.user._id, username: req.user.username },
    };

    const post = await deletePost(filter);

    res.send(post);
  } catch (err) {
    res.send(err.message);
  }
};
