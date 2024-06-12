const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const UserController = require("../controllers/userController");

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
    // const user = await User.findUserByCredentials(
    //   req.body.email,
    //   req.body.password
    // );
    const user = await userController.loginUser(values);

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
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
