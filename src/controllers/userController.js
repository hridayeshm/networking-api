import bcrypt from 'bcrypt'
import sendVerficationMail from "../service/verificationMail.js"
import {register, verify, login, changePw, show} from "../repositories/userRepository.js";
import {createTokenFromController} from "../repositories/tokenRepository.js"
import { v4 as uuidv4 } from 'uuid';
import { listFollowees, listFollowers, listNotifications, sendRequest, respond } from '../repositories/followRepository.js'
import { add, create, list, participate } from '../repositories/eventRepository.js'


  export const registerUser = async (req, res, next) => {
    try {
      const values = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        emailVerificationToken: uuidv4(),
      };

      const user = await register(values);

      sendVerficationMail(values);

      res.status(201).send("user registered . check email for verification");
    } catch (err) {
      console.log(err);
    }
  }

 export const loginUser = async(req, res, next) => {
    try {
      const filter = req.body;

      const user = await login(filter);

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
      
      const tokenDoc = await createTokenFromController(email, uuid, user);

      res.send([token, tokenDoc]);
    } catch (err) {
      console.log(err);
    }
  }

  export const sendFollowRequest = async(req, res, next) => {
    try {
      const values = {
        follower: req.user._id,
        followee: req.params.id,
        from: req.user._id,
        to: req.params.id,
        status: "requested",
      };
     
      const notification = await sendRequest(values);
      res.send(notification);
    } catch (err) {
      res.send(err);
    }
 
  }

  export const listAllNotifications = async(req, res, next) => {
    try {
      const values = { to: req.user._id };
     
      const notifications = await listNotifications(values);
      res.send(notifications);
    } catch (err) {
      res.send(err);
    }
  
  }

  export const respondToRequest = async(req, res, next) => {

    try{
      const action = req.params.action;
      const values = { from: req.params.id, to: req.user._id };
  
    
      const response = await respond(values, action);
     
      res.send(response);
    }catch(err){
      res.send(err);
    }
 
  }

  export const listAllFollowers = async(req, res, next) => {
    try{
      const values = {_id : req.user._id};
    
      const followers = await listFollowers(values);
      res.send(followers);
    }catch(err){
      res.send(err.message);
    }
  
  }

  export const listAllFollowees = async(req,res, next) => {
    try{
      const values = {_id : req.user._id};
      
      const followees = await listFollowees(values);
      res.send(followees);
    }catch(err){
      res.send(err.message);
    }

  }

  export const changePasssword = async(req, res, next) => {
    try {
      const values = {
        userID: req.user._id,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
      };
  
      const newPassword = await changePw(values);
      res.send(newPassword);
    } catch (err) {
      res.send(err.message);
    }
  
  }

  export const showFeed = async(req, res, next) => {
    try {
      const filter = { _id: req.user._id };
   
      const feed = await show(filter);
      res.send(feed);
    } catch (err) {
      res.send(err.message);
    }
 
  }

  export const verifyUser = async(req, res, next) => {
    try {
      const emailVerificationToken = req.params.verificationToken;

      const user = await verify(emailVerificationToken);
      res.send(user);
    } catch (err) {
      res.send(err);
    }
  }

  export const createEvent = async(req, res, next) => {
    try {
      const values = {
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
        status: "active",
        organizer: req.user._id,
      };
    
      const event = await create(values);
      res.send(event);
    } catch (err) {
      res.send(err.message);
    }
  
  }

  export const listEvents = async(req, res, next) => {
    try {

      const events = await list();
      res.send(events);
    } catch (err) {
      res.send(err.message);
    }
  
  }

  export const addParticipant = async(req, res, next) => {
    try {
      const participantID = req.params.id;
      const values = {
        organizer: req.user._id,
      };
   
      const event = await add(values, participantID);
      res.send(event);
    } catch (err) {
      res.send(err.message);
    }
  
  }

  export const userParticipate = async(req, res ,next) => {
    try {
      const values = {
        _id: req.params.eventID,
      };
  
    
      const event = await participate(values, req);
      res.send(event);
    } catch (err) {
      res.send(err.message);
    }

  }

  export const logoutUser = async(req, res, next) => {
    try{
      const userID = req.user._id;
      const tokenUUID = req.token.uuid;
  
      const user = await logout(userID, tokenUUID);
      
      res.send(user);
  
    }catch(err){
      res.send(err.message);
    }

  }



