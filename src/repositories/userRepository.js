import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import bcrypt from "bcrypt"


  export const register = async(userDetails) => {
    try {
      const user = new User(userDetails);

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  export const verify = async(emailVerificationToken) => {
    try {
      const user = await User.findOneAndUpdate(
        { emailVerificationToken },
        {
          mailVerifiedAt: new Date(),
          emailVerificationToken: null,
          status: "active",
        },
        { new: true }
      );
      if (!user) {
        throw new Error("invalid token");
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  export const login = async(filter) => {
    try {
        const user = await User.findOne({ email: filter.email });
  
        return user;
      } catch (err) {
        console.log(err);
      }
  }

  export const changePw = async(values) => {
    try {
      const user = await User.findOne({ _id: values.userID });

      if (!(await bcrypt.compare(values.oldPassword, user.password))) {
        throw new Error("old password does not match");
      }

      user.password = values.newPassword;
      await user.save();
      return user;
    } catch (err) {
      console.log(err, "async");
      throw err;
    }
  }

  export const show = async(filter) => {
  
    try {
      const user = await User.findOne(filter).populate("followees", "_id");
  
      
      const posts = await Post.find({ owner: { $in: user.followees } }); // BECAUSE FOLLOWEES ONLY CONTAIN ID(selected)SO DIRECT PASS
      // for populating comments also when getting posts, use virtual field ????
      return posts;
    } catch (err) {
      throw err;
    }
  }

  export const logout = async(userID, tokenUUID) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: userID },
        { status: "inactive" },
        { new: true }
      );
      await Token.deleteOne({ uuid: tokenUUID });
      return user;
    } catch (err) {
      throw err;
    }
  }



