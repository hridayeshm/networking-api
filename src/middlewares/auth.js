const jwt =require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async(req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer', '');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
    } catch(err){

    }
}
