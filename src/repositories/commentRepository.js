class commentRepository{

async addComment(){
    try {
   
        const values = {
          post: req.params.id,
          author: req.user._id,
          content: req.body.content,
        };
    
        const commentController = new CommentController();
        const comment = await commentController.addComment(values, req);
      
        res.send(comment);
      } catch (err) {
        res.send(err);
      }
}
}