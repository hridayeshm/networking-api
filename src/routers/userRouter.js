const express = require("express");
const router = express.Router();
const Token = require("../models/tokenModel");
const UserController = require("../controllers/userController");
const userController = new UserController();
const auth = require("../middlewares/auth");
// const CLIENT_ID = '373933302832';
// const CLIENT_SECRET = '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';
// const REDIRECT_URI = '<http://localhost:3000/auth/google/callback>';

router.post("/users/register", userController.registerUser);

router.post("/user/verify/:verificationToken", userController.verifyUser);

router.post("/user/login", userController.loginUser);


router.patch("/user/change-password", auth, async (req, res) => {
  try {
    const values = {
      userID: req.user._id,
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
    };

    const newPassword = await userController.changePassword(values);
    res.send(newPassword);
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/user/feed", auth, async (req, res) => {
  try {
    const values = { _id: req.user._id };
 
    const feed = await userController.showFeed(values);
    res.send(feed);
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/user/logout", auth, async(req, res) => {
  try{
    const userID = req.user._id;
    const tokenUUID = req.token.uuid;//AAAAAAAAAAAAAAAAAASSSSSSSSSSSSSSSSSSSKKKKKKKKKKKKKKKKKKKKKK why i stored in req.token
   

    const user = await userController.logoutUser(userID, tokenUUID);
    
    res.send(user);

  }catch(err){
    res.send(err.message);
  }
});

module.exports = router;







// router.get('/auth/google', (req, res) => {
//   const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
//   res.redirect(url);
// });

// // Callback URL for handling the Google Login response
// router.get('/auth/google/callback', async (req, res) => {
//   const { code } = req.query;

//   try {
//     // Exchange authorization code for access token
//     const { data } = await axios.post('<https://oauth2.googleapis.com/token>', {
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       code,
//       redirect_uri: REDIRECT_URI,
//       grant_type: 'authorization_code',
//     });

//     const { access_token, id_token } = data;

//     // Use access_token or id_token to fetch user profile
//     const { data: profile } = await axios.get('<https://www.googleapis.com/oauth2/v1/userinfo>', {
//       headers: { Authorization: `Bearer ${access_token}` },
//     });

//     // Code to handle user authentication and retrieval using the profile data

//     res.redirect('/');
//   } catch (error) {
//     console.error('Error:', error.response.data.error);
//     res.redirect('/login');
//   }
// });

// router.get('/logout', (req, res) => {

//   res.redirect('/login');
// });
