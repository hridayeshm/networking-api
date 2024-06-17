const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const UserController = require("../controllers/userController");
const auth = require("../middlewares/auth");


router.post("/users/register", async (req, res) => {
  try {
    const values = req.body;
    const userController = new UserController();
    //const emailVerificationToken = uuidv4()
    //values.emailVerificationToken = emailVerificationToken;
    const user = await userController.registerUser(values);
    //await userController.sendMail(values, emailVerificationToken);

    res.status(201).send(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const values = req.body;
    const userController = new UserController();

    const user = await userController.loginUser(values);

    const token = await user.generateAuthToken();

   // await userController.sendMail(values, token);

    
    res.send({ user, token });
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/user/follow/:id", auth, async (req, res) => {
  try {
    const values = {
      follower: req.user._id,
      followee: req.params.id,
      from: req.user._id,
      to: req.params.id,
      status: "requested",
    };
    const userController = new UserController();
    const notification = await userController.sendFollowRequest(values);
    res.send(notification);
  } catch (err) {
    res.send(err);
  }
});

router.get("/user/list-all-notifications", auth, async (req, res) => {
  try {
    const values = { to: req.user._id };
    const userController = new UserController();
    const notifications = await userController.listAllNotifications(values);
    res.send(notifications);
  } catch (err) {
    res.send(err);
  }
});

router.patch("/user/respond-to-request/:id/:action", auth, async (req, res) => {
  try{
    const action = req.params.action;
    const values = { from: req.params.id, to: req.user._id };

    const userController = new UserController();
    const response = await userController.respond(values, action);
    res.send(response);
  }catch(err){
    res.send(err);
  }
});

router.get("/user/list-all-followers", auth, async(req, res) => {
  try{
    const values = {_id : req.user._id};
    const userController = new UserController();
    const followers = await userController.listFollowers(values);
    res.send(followers);
  }catch(err){
    res.send(err.message);
  }
});

router.get("/user/list-all-followees", auth, async(req,res) => {
  try{
    const values = {_id : req.user._id};
    const userController = new UserController();
    const followees = await userController.listFollowees(values);
    res.send(followees);
  }catch(err){
    res.send(err.message);
  }
});

router.patch("/user/change-password", auth, async(req,res) => {
  try{
    const values = {userID : req.user._id, oldPassword: req.body.oldPassword, newPassword: req.body.newPassword};
    const userController = new UserController();
    const newPassword = await userController.changePassword(values);
    res.send(newPassword);
  }catch(err){
    res.send(err.message);
  }
});

router.get("/user/feed", auth, async(req,res) => {
  try{
    const values = { _id: req.user._id};
    const userController = new UserController();
    const feed = await userController.showFeed(values);
    res.send(feed);
  }catch(err){
    res.send(err.message);
  }
});

// router.get("/users/:id", async (req, res) => {
//   console.log(req.params.id);
//   try {
//     const user = await User.findById(req.params.id);
//     console.log(user);
//     res.send(user);
//   } catch (e) {
//     res.status(404).send();
//   }
// });

module.exports = router;
