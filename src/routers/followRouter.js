import express from 'express'
const router = express.Router();

const UserController = require("../controllers/userController");
import auth from "../middlewares/auth.js"

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

export default router;