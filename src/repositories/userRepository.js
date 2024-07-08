const User = require("../models/userModel");
const Post = require("../models/postModel");

class UserRepository {
  async register(values) {
    try {
      const user = new User(values);

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  async verify(emailVerificationToken) {
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

  async login(filter){
    try {
        const user = await User.findOne({ email: filter.email });
  
        return user;
      } catch (err) {
        console.log(err);
      }
  }

  async changePassword(values){
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

  async showFeed(values){
    try {
      const user = await User.findOne(values).populate("followees", "_id");
      console.log(user);

      const posts = await Post.find({ owner: { $in: user.followees } }); // BECAUSE FOLLOWEES ONLY CONTAIN ID SO DIRECT PASS
      // for populating comments also when getting posts, use virtual field
      return posts;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserRepository;
