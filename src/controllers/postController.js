const Post = require("../models/postModel")

class PostController{

    async createPost(values){
        const Post = new Post(values);
    }

}