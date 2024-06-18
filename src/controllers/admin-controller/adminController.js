const Admin = require("../../models/adminModel");
const Post = require("../../models/postModel");
const User = require("../../models/userModel");

class AdminController {
  async login(values) {
    try {
      
      const admin = await Admin.findOneAndUpdate(values, {isActive: true}, {new: true});
    
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
      const allPosts = await Post.find();
      if(!allPosts){
        throw new Error("no post found");
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
