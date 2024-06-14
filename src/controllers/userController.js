const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Notification = require("../models/notificationModel");
const Follow = require("../models/followModel");

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
      if(!notifications || notifications.length === 0){
        throw new Error("no notifications found");
      }

      return notifications;
    } catch (err) {
      throw err;
    }
  }

  async respond(values, action){
    try{
      if(action.toLowerCase() === "reject"){
        const updates = {
          status: "rejected"
        };

        const notification = await Notification.findOneAndUpdate(values, updates, {new: true});

        return notification;

      } else if(action.toLowerCase() === "accept"){
        const updates = {
          status: "accepted"
        };
        
        const notification = await Notification.findOneAndUpdate(values, updates, {new: true});

        const user = await User.findOneAndUpdate({_id: values.to}, {followers: values.from});

        const follow = new Follow({follower: values.from, followee:values.to});
        await follow.save();

        return [notification, user];

      }
    
    }catch(err){
      throw err;
    }
  }

  async listFollowers(values){
    
  }
}

module.exports = UserController;
