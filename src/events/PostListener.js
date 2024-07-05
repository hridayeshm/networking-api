const EventEmitter = require("events");
const postEmitter = new EventEmitter();

const postDeletedEvent = (post) => {
  postEmitter.emit("postDeleted", post._id);
};

const postDeletedHandler = async() => {
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

postEmitter.on("postDeleted",postDeletedHandler);

module.exports = postDeletedEvent;
