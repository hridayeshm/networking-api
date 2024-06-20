const Admin = require("../../models/adminModel");
const Post = require("../../models/postModel");
const User = require("../../models/userModel");

class AdminController {
  async login(values) {
    try {
      
      const admin = await Admin.findOne(values);
    
      if(!admin){
        throw new Error("no admin found");
      }
          
      return admin;
    } catch (err) {
      throw err;
    }
  }

  async listAllUsers(){
    try{
        const allUsers = await User.find();
        if(!allUsers){
          throw new Error("no users found");
        }
        return allUsers;
    }catch(err){
        throw err;
    }
  }

  async listAllPosts(){
    try{
      const allPosts = await Post.find().populate("owner","username").exec();
      if(!allPosts){
        throw new Error("no posts found");
      }
      return allPosts;
    }catch(err){
      throw err;
    }
  }

  async logout(values){
    try{
     const admin = await Admin.findOneAndUpdate({values}, {isActive: "false"}, {new: true});
     return admin;
    }catch(err){
      throw err;
    }
  }
}

module.exports = AdminController;
