import { create } from "../repositories/postRepository.js";

export const createPost = async ({ data }, user) => {
  console.log(data);
  const postDetails = {
    ...data,
    owner: { id: user._id, username: user.username },
  };

  const post = await create(postDetails);
  return post;
};

export const getPostByID = async () => {
  try {

  } catch (err) {
    throw err;
  }
};
