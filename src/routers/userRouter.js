const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const UserController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const { v4: uuidv4 } = require("uuid");

router.post("/users/register", async (req, res) => {
  try {
    const values = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      emailVerificationToken: uuidv4(),
    };

    const userController = new UserController();

    const user = await userController.registerUser(values);
    const verificationMessage = await userController.sendMail(values);

    res.status(201).send(verificationMessage);
  } catch (err) {
    console.log(err);
  }
});

router.post("/user/verify/:verificationToken", async (req, res) => {
  try {
    const emailVerificationToken = req.params.verificationToken;
    const userController = new UserController();
    const user = await userController.verify(emailVerificationToken);
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const values = req.body;
    const userController = new UserController();

    const user = await userController.loginUser(values);

    const { token, uuid } = await user.generateAuthToken();
    //save in toke schema TokenSchema.create({})

    res.send({ user, token });
  } catch (err) {
    res.send(err.message);
  }
});

router.patch("/user/change-password", auth, async (req, res) => {
  try {
    const values = {
      userID: req.user._id,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    };
    const userController = new UserController();
    const newPassword = await userController.changePassword(values);
    res.send(newPassword);
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/user/feed", auth, async (req, res) => {
  try {
    const values = { _id: req.user._id };
    const userController = new UserController();
    const feed = await userController.showFeed(values);
    res.send(feed);
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/user/create-event", auth, async (req, res) => {
  try {
    const values = {
      title: req.body.title,
      description: req.body.description,
      startDate: startDate,
      endDate: endDate,
      location: req.body.location,
      status: "active",
      organizer: req.user._id
    };
    const userController = new UserController();
    const event = await userController.createEvent(values);
    res.send(event);
  } catch (err) {
    res.send(err);
  }
});

router.post("/user/add-participant/:id", auth, async(req, res) => {
  try{
    const participantID = req.params.id;
    const values = {
      organizer : req.user._id,
    };
    const userController = new UserController();
    const event = await userController.addParticipant(values, participantID);
  }catch(err){
    res.send(err);
  }
});

module.exports = router;
