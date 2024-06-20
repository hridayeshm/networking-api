const express = require("express");
const router = express.Router();
const Token = require("../models/tokenModel");
const UserController = require("../controllers/userController");
const auth = require("../middlewares/auth");


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
    await userController.sendMail(values);

    res.status(201).send("user registered . check email for verification");
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

    const [token, username] = await user.generateAuthToken();
    console.log(username)
    
    const tokenDoc = new Token({username});
    await tokenDoc.save();

    res.send(token);
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

router.post("/user/logout", auth, async(req, res) => {
  try{

  }catch(err){
    res.send(err.message);
  }
});

module.exports = router;
