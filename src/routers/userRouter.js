const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const UserController = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.post("/users/register", async (req, res) => {
  try {
    const values = req.body;
    const userController = new UserController();
    const user = await userController.registerUser(values);
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

router.get("user/list-all-followers", auth, async(req, res) => {
  try{
    const values = 
    const userController = new UserController();
    const followers = await userController.listFollowers()
  }catch(err){
    res.send(err);
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
