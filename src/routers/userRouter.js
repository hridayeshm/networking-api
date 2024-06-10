const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
require("../db/mongoose");


router.post('/users/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send(user);

  } catch (err) {
    console.log(err);
  }
});

router.post('/users/login', async (req,res) => {
  try{
    const user = await User.findUserByCredentials(req.body.email, req.body.password);
    const token = a;
  } catch(err) {

  }
})

router.get('/users/:id', async(req,res) => {
    console.log(req.params.id)
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        res.send(user);
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;
