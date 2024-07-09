
import { view, update, deleteCommentAuthor, deleteCommentPostOwner, add } from "../repositories/commentRepository.js";


  export const addComment = async(req, res, next) => {

    try {
   
      const values = {
        post: req.params.id,
        author: req.user._id,
        content: req.body.content,
      };
  
    
      const comment = await add(values, req);
    
    
      res.send(comment);
    } catch (err) {
      res.send(err);
    }

  }

  export const viewComments = async(req, res, next) => {
    try {
      const values = {
        post: req.params.id,
      };
     
      const comments = await view(values);
      res.send(comments);
    } catch (err) {
      res.send(err.message)
    }

  }

  export const updateComment = async(req, res, next) => {
    try {
      const values = {
        _id: req.params.id,
        author: req.user._id,
        content: req.body.content,
      };
  
  
      const updatedComment = await update(values);
      res.send(updatedComment);
    } catch (err) {
      res.send(err.message);
    }

  }

  export const deleteCommentByAuthor = async(req, res, next) => {

    try {
      const values = {
        _id: req.params.id,
        author: req.user._id,
      };
    
      const deletedComment = await deleteCommentAuthor(values);
      res.send(deletedComment);
    } catch (err) {
      res.send(err.message);
    }

  }

  export const deleteCommentByPostOwner = async(req, res, next) => {

    try{
      const postID = req.params.postID;
      const commentID = req.params.id;
      const ownerID = req.user._id;
     
      
      const deletedComment = await deleteCommentPostOwner(postID, commentID, ownerID);
      res.send(deletedComment); 
    }catch(err){
      res.send(err.message);
    }

  }

