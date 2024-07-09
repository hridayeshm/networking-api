import Admin from "../../models/adminModel.js"
import User from "../../models/userModel.js"
import Post from "../../models/postModel.js"
import Token from "../../models/tokenModel.js"

export const login = async(values) => {
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

export const listUsers = async() => {
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

export const listPosts = async() => {
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

export const block = async() => {
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

export const logout = async(tokenUUID) => {
    try {
        await Token.deleteOne({ uuid: tokenUUID });
        return "admin logout successful";
      } catch (err) {
        throw err;
      }
}