const bcrypt = require("bcrypt");
const Notification = require("../models/notificationModel");
const Follow = require("../models/followModel");
const Post = require("../models/postModel");
const sendVerficationMail = require("../service/verificationMail");
const Event = require("../models/eventModel");
const Token = require("../models/tokenModel");
const User = require("../models/userModel");
const UserRepository = require("../repositories/userRepository");
const userRepository = new UserRepository();
const TokenRepository = require("../repositories/tokenRepository");
const tokenRepository = new TokenRepository();
const { v4: uuidv4 } = require("uuid");


  export const registerUser = async (req, res, next) => {
    try {
      const values = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        emailVerificationToken: uuidv4(),
      };

      const user = await userRepository.register(values);

      sendVerficationMail(values);

      res.status(201).send("user registered . check email for verification");
    } catch (err) {
      console.log(err);
    }
  }

 export const loginUser = async(req, res, next) => {
    try {
      const filter = req.body;

      const user = await userRepository.login(filter);

      if (!user) {
        throw new Error("user not found");
      }
      if (!(await bcrypt.compare(filter.password, user.password))) {
        throw new Error("login with correct email and password");
      }
      if (user.status === "inactive") {
        throw new Error(
          "user has not been activated yet. please check mail for verificaiton"
        );
      }
      if (user.status === "blocked") {
        throw new Error("please contact administrator");
      }

      const [token, email, uuid] = await user.generateAuthToken();
      const tokenDoc = await tokenRepository.createToken(email, uuid, user);

      res.send([token, tokenDoc]);
    } catch (err) {
      console.log(err);
    }
  }

  export const sendFollowRequest = async(values) => {
    try {
      const notification = new Notification(values);
      await notification.save();
      return notification;
    } catch (err) {
      throw err;
    }
  }

  export const listAllNotifications = async(values) => {
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

  export const changePasssword = async(req, res, next) => {
    try {
      const values = {
        userID: req.user._id,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
      };
  
      const newPassword = await userRepository.changePassword(values);
      res.send(newPassword);
    } catch (err) {
      res.send(err.message);
    }
  
  }

  export const showFeed = async(req, res, next) => {
    try {
      const values = { _id: req.user._id };
   
      const feed = await userRepository.showFeed(values);
      res.send(feed);
    } catch (err) {
      res.send(err.message);
    }
 
  }

  export const verifyUser = async(req, res, next) => {
    try {
      const emailVerificationToken = req.params.verificationToken;

      const user = await userRepository.verify(emailVerificationToken);
      res.send(user);
    } catch (err) {
      res.send(err);
    }
  }

  export const createEvent = async(values) => {
    try {
      const event = new Event(values);
      if (!event) {
        throw new Error("failed to create event");
      }
      await event.save();
      return event;
    } catch (err) {
      throw err;
    }
  }

  export const listEvents = async() => {
    try {
      const events = Event.find();
      return events;
    } catch (err) {
      throw err;
    }
  }

  export const addParticipant = async(values, participantID) => {
    try {
      const event = await Event.findOneAndUpdate(
        values,
        { $push: { participants: participantID } },
        { new: true }
      );
      if (!event) {
        throw new Error("event not found");
      }
      return event;
    } catch (err) {
      throw err;
    }
  }

  export const participate = async(values, req) => {
    try {
      const event = await Event.findOneAndUpdate(
        values,
        { $push: { participants: req.user._id } },
        { new: true }
      );
      if (!event) {
        throw new Error("event not found");
      }
      return event;
    } catch (err) {
      throw err;
    }
  }

  export const logoutUser = async(userID, tokenUUID) => {
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



