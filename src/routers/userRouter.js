import express from 'express';
const router = express.Router();
import { registerUser, loginUser, sendFollowRequest,listAllNotifications,respond,listFollowers,listFollowees,changePasssword, showFeed,verifyUser,createEvent,listEvents,addParticipant,participate,logoutUser } from '../controllers/userController.js';

import auth from "../middlewares/auth.js";
// const CLIENT_ID = '373933302832';
// const CLIENT_SECRET = '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';
// const REDIRECT_URI = '<http://localhost:3000/auth/google/callback>';

router.post("/users/register", registerUser);

router.post("/user/verify/:verificationToken",verifyUser);

router.post("/user/login", loginUser);

router.patch("/user/change-password", auth, changePasssword);

router.get("/user/feed", auth, showFeed);

router.post("/user/logout", auth, async(req, res) => {
  try{
    const userID = req.user._id;
    const tokenUUID = req.token.uuid;

    const user = await userController.logoutUser(userID, tokenUUID);
    
    res.send(user);

  }catch(err){
    res.send(err.message);
  }
});

export default router;







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
