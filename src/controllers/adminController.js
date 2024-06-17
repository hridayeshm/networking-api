const Admin = require("../models/adminModel");

class AdminController {
  async login(values) {
    try {
      const admin = await Admin.findOne(values);

      if(!admin){
        throw new Error("no admin found");
      }

      return admin;
    } catch (err) {
      throw err;
    }
  }

  async logout(values){
    try{
        
    }catch(err){
        throw err;
    }
  }
}

module.exports = AdminController;
