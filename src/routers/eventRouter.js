const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const auth = require("../middlewares/auth");


router.post("/user/create-event", auth, async (req, res) => {
    try {
      const values = {
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
        status: "active",
        organizer: req.user._id
      };
      const userController = new UserController();
      const event = await userController.createEvent(values);
      res.send(event);
    } catch (err) {
      res.send(err.message);
    }
  });
  
  router.get("/user/get-all-events", auth, async(req,res) => {
    try{
      const userController = new UserController();
      const events = await userController.listEvents();
      res.send(events);
    }catch(err){
      res.send(err.message);
    }
  });
  
  router.patch("/user/add-participant/:id", auth, async(req, res) => {
    try{
      const participantID = req.params.id;
      const values = {
        organizer : req.user._id,
      };
      const userController = new UserController();
      const event = await userController.addParticipant(values, participantID);
      res.send(event);
    }catch(err){
      res.send(err.message);
    }
  });
  
  router.post("/user/participate/:eventID", auth, async(req,res) => {
    try{
      const values = {
        _id: req.params.eventID
      };
  
      const userController = new UserController();
      const event = await userController.participate(values,req);
      res.send(event);
    }catch(err){
      res.send(err.message);
    }
  });

  module.exports = router;