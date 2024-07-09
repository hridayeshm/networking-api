import { listPosts, listUsers, login, block, logout } from "../../repositories/adminRepository/adminRepository.js";


  export const adminLogin = async(req, res, next) => {
    try {
      const values = req.body;
      
      const admin = await login(values);
      const [token, email, uuid, _id] = await admin.generateAuthToken();
      console.log(token);
      const tokenDoc = new Token({ email, uuid, user: _id });
      await tokenDoc.save();
  
      res.send([token, tokenDoc]);
    } catch (err) {
      console.log(err.message);
    }

  }

  export const listAllUsers = async(req, res, next) => {
    try {
    
      const allUsers = await listUsers();
      res.send(allUsers);
    } catch (err) {
      res.send(err);
    }
  
  }

  export const listAllPosts = async(req, res, next) => {
    try {
    
      const allPosts = await listPosts();
      res.send(allPosts);
    } catch (err) {
      res.send(err);
    }
   
  }

  export const blockUser = async(req, res, next) => {
    try {
      const userID = req.params.id;
    
      const [blockedUser, deletedToken] = block(userID);
      res.send([blockedUser, deletedToken]);
    } catch (err) {
      console.log(err); // inside blockUser
    }

  }

  export const adminLogout = async(req, res, next) => {
    try {
      const tokenUUID = req.token.uuid;
      
      const admin = await logout(tokenUUID);
  
      res.send(admin);
    } catch (err) {
      res.send(err.message);
    }
 
  }


