const Admin = require("../../models/adminModel");
const Post = require("../../models/postModel");
const User = require("../../models/userModel");
const Token = require("../../models/tokenModel");

class AdminController {
  async login(values) {
    try {
      const admin = await Admin.findOne(values);

      if (!admin) {
        throw new Error("no admin found");
      }

      return admin;
    } catch (err) {
      throw err;
    }
  }

  async listAllUsers() {
    try {
      const allUsers = await User.find();
      if (!allUsers) {
        throw new Error("no users found");
      }
      return allUsers;
    } catch (err) {
      throw err;
    }
  }

  async listAllPosts() {
    try {
      const allPosts = await Post.find().populate("owner", "username").exec();
      if (!allPosts) {
        throw new Error("no posts found");
      }
      return allPosts;
    } catch (err) {
      throw err;
    }
  }

  async blockUser(userID) {
    try {
      const blockedUser = await User.findOneAndUpdate(
        { _id: userID },
        { status: "blocked" },
        { new: true }
      );
      
      const deletedToken = await Token.deleteOne({_id: blockedUser._id}); 
// CHECKKKKKKKKKKKKKKKKKKKKKKKK DELETEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
      return [blockedUser, deletedToken];
    } catch (err) {
      throw err;
    }
  }

  async logout(tokenUUID) {
    try {
      await Token.deleteOne({ uuid: tokenUUID });
      return "admin logout successful";
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AdminController;
