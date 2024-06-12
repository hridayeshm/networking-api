const User = require("../models/userModel");
const bcrypt = require("bcrypt");

class UserController{

    async registerUser(values){
        try{
            const user = new User(values);
            console.log(user);
            await user.save();
            return user;
        }catch(err){
            throw err;
        }
    }

    async loginUser(values){
        try{
            const user = await User.findOne({email: values.email});

            if(!user){
                throw new Error("user not found");
            }
            if(!await bcrypt.compare(values.password, user.password)){
                throw new Error("login with correct email and password");
            }

            return user;
        }catch(err){
            throw err;
        }
    }
        
}

module.exports = UserController;