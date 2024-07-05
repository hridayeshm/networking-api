const bcrypt = require("bcrypt");
const Notification = require("../models/notificationModel");
const Follow = require("../models/followModel");
const Post = require("../models/postModel");
const sendVerficationMail = require("../service/verificationMail");
const Event = require("../models/eventModel");
const Token = require("../models/tokenModel");
const UserRepository = require("../repositories/userRepository");
const userRepository = new UserRepository();
const TokenRepository = require("../repositories/tokenRepository");
const tokenRepository = new TokenRepository();
const { v4: uuidv4 } = require("uuid");

class UserController {
  async registerUser(req, res, next) {
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

  async loginUser(req, res, next) {

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
      const tokenDoc = await tokenRepository.createToken(email, uuid);
    
      
  
      res.send([token, tokenDoc]);
    } catch (err) {
      console.log(err);
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

  async changePasssword(values) {
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
      const user = await User.findOne(values).populate("followees", "_id");
      console.log(user);

      const posts = await Post.find({ owner: { $in: user.followees } });
      // for populating comments also when getting posts, use virtual field
      return posts;
    } catch (err) {
      throw err;
    }
  }

  async verifyUser(req, res, next) {
    try {
      const emailVerificationToken = req.params.verificationToken;
     
      const user = await userRepository.verify(emailVerificationToken);
      res.send(user);
    } catch (err) {
      res.send(err);
    }  
 
  }

  async createEvent(values) {
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

  async listEvents() {
    try {
      const events = Event.find();
      return events;
    } catch (err) {
      throw err;
    }
  }

  async addParticipant(values, participantID) {
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

  async participate(values, req) {
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

  async logoutUser(userID, tokenUUID) {
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
}

module.exports = UserController;
