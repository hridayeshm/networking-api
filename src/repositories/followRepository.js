import Follow from "../models/followModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js"

export const sendRequest = async(values) => {
    try {
 
        const notification = new Notification(values);
        await notification.save();
        return notification;
      } catch (err) {
        throw err;
      }
}

export const listNotifications = async(values) => {
    try {
        const notifications = await Notification.aggregate([
          { $match:  values  },
          {
            $lookup: {
              from: "users",
              localField: "follower",
              foreignField: "_id",
              as: "follower",
            },
          },
          {
            $project: {
              "follower.username": 1,
              "follower._id": 1,
              "follower.email": 1,
              "follower.followers": 1,
              status: 1
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]);
       
        if (!notifications || notifications.length === 0) {
          throw new Error("no notifications found");
        }
  
        return notifications;
      } catch (err) {
        throw err;
      }
}

export const respond = async(values, action) => {
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

export const listFollowers = async(values) => {
    try {
        const followers = await User.find(values)
          .populate("followers", "_id username")
          .select("followers")
          .exec();
        if (!followers) {
          return "no followers";
        }
        return followers;
      } catch (err) {
        throw err;
      }
}

export const listFollowees = async(values) => {
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