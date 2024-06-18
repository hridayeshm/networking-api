const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Notification = require("../models/notificationModel");
const Follow = require("../models/followModel");
const Post = require("../models/postModel");
const sendVerficationMail = require("../service/mail");

class UserController {
  async registerUser(values) {
    try {
      const user = new User(values);

      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  async loginUser(values) {
    try {
      const user = await User.findOne({ email: values.email });

      if (!user) {
        throw new Error("user not found");
      }
      if (!(await bcrypt.compare(values.password, user.password))) {
        throw new Error("login with correct email and password");
      }
      if(user.status !== "active"){
        throw new Error("user has not been activated yet. please check mail for verificaiton");
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async sendFollowRequest(values) {
    try {
      const notification = new Notification(values);
      await notification.save();
      return notification;
    } catch (err) {
      throw err;
    }
  }

  async listAllNotifications(values) {
    try {
      const notifications = await Notification.find(values);
      if (!notifications || notifications.length === 0) {
        throw new Error("no notifications found");
      }

      return notifications;
    } catch (err) {
      throw err;
    }
  }

  async respond(values, action) {
    try {
      if (action.toLowerCase() === "reject") {
        const updates = {
          status: "rejected",
        };

        const notification = await Notification.findOneAndUpdate(
          values,
          updates,
          { new: true }
        );

        return notification;
      } else if (action.toLowerCase() === "accept") {
        const updates = {
          status: "accepted",
        };

        const notification = await Notification.findOneAndUpdate(
          values,
          updates,
          { new: true }
        );

        const followedUser = await User.findOneAndUpdate(
          { _id: values.to },
          { $push: { followers: values.from } },
          { new: true }
        );

        const followingUser = await User.findOneAndUpdate(
          { _id: values.from },
          { $push: { followees: values.to } },
          { new: true }
        );

        const follow = new Follow({
          follower: values.from,
          followee: values.to,
        });
        await follow.save();

        return notification;
      }
    } catch (err) {
      throw err;
    }
  }

  async listFollowers(values) {
    try {
      const followers = await User.find(values)
        .populate("followers", "_id username")
        .select("followers")
        .exec();
      if (!followers) {
        throw new Error("no followers");
      }
      return followers;
    } catch (err) {
      throw err;
    }
  }

  async listFollowees(values) {
    try {
      const followees = await User.find(values)
        .populate("followees", "_id username")
        .select("followees")
        .exec();
      if (!followees) {
        throw new Error("no followees");
      }
    } catch (err) {
      throw err;
    }
  }

  async changePassword(values) {
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

  async showFeed(values) {
    try {
      const user = await User.findOne(values).populate('followees', '_id');
      console.log(user);

      const posts = await Post.find({owner: {$in: user.followees}});
      // for populating comments also when getting posts, use virtual field
      return posts;
    } catch (err) {
      throw err;
    }
  }

  async sendMail(values){
    sendVerficationMail(values);
  }

  async verify(emailVerificationToken){
   try{
    const user = await User.findOneAndUpdate({emailVerificationToken},{mailVerifiedAt: new Date(), emailVerificationToken: null, status: "active"}, {new: true});
    if(!user){
      throw new Error("invalid token");
    }

    return user;
   }catch(err){
    throw err;
   }
  }

  async createEvent(values){
    try{
      const event = new Event(values);
      await event.save();
      return event;
    }catch(err){
      throw err;
    }
  }
}

module.exports = UserController;
