const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid'); 
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        trim: true,
        validate(value){
            if (value.includes('-')){
                throw new Error('Password cant contain certain special characters');
            }
        }
    },
    // tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }],
},
{
    timestamps: true
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    
    const jwt_payload = { _id: user._id.toString(), email: user.email, username: user.username };
    const token = jwt.sign(jwt_payload, process.env.SECRET_KEY);
    await user.save();
    // user.tokens = user.tokens.concat({ token });
    // await user.save().then(() => { 
    //     console.log("saved");      //CHECK LATER
    // })

    return token;
}

// userSchema.statics.findUserByCredentials = async function(email, password) {
//     const user = await User.findOne({email});

//     if(!user){
//         throw new Error("Unable to login");
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if(!isMatch){
//         throw new Error('Login with correct email and password');
//     }

//     return user;
// }

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;