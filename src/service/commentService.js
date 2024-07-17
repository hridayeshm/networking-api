import { view } from "../repositories/commentRepository.js";

export const viewComments = async (args) => {
  try {
    const filter = { post: args.id };
    const comments = await view(filter);
    return comments;
  } catch (err) {
    throw err;
  }
};
