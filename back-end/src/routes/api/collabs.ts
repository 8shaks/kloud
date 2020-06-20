import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import validateCollabRequest from "../../validation/friendRequest"
import Collab from "../../models/Collab";
import Profile from "../../models/Profile";
import { IProfile, ICollab } from "../../@types/custom"


// @route    GET api/collabs
// @desc     Get all a users collabs
// @access   Private
function getMyCollabs(profile:IProfile):Promise<any>{
  return new Promise<ICollab[]>((resolve, reject) => {
    let myCollabs:ICollab[] = [];
    if (profile.collabs)  resolve(myCollabs) 
    profile!.collabs.forEach(async (collabId) => {
      let collab = await Collab.findById(collabId);
      if (collab)
        myCollabs.push(collab);
      if (myCollabs.length === profile!.collabs.length)
        resolve(myCollabs);
    });
  });
}
router.get('/mycollabs', auth, async (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});

  try {
    const profile = await Profile.findOne({user:req.user.id});

    if(!profile) return res.status(400).json({errors: { profile: 'Cannot find your profile' }});
 
    getMyCollabs(profile).then((myCollabs)=>{
      return res.json(myCollabs)
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route    POST api/friends/send_req
// @desc     Send a friend Request to a user
// @access   Private
router.post('/send_req', auth, async (req, res) => {
    const { errors, isValid } = validateCollabRequest(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    try {
      let user = req.user!
      const userProfile = await Profile.findOne({user:user.id});
      if (!userProfile) {
        return res.status(400).json({errors: { collabs: "You do not have a Profile" }});
      }
    // find user they want to send request to
      const profileToCollab = await Profile.findOne({username:req.body.username});
      if(!profileToCollab)  return res.status(400).json({errors: { collabs: 'We could not find the user you wanted to collab with' }});
      if(profileToCollab.username === user.username) return res.status(400).json({errors: { collabs: 'You cannot collab with yourself' }});

      if(profileToCollab.collabRequestsRecieved.filter(u => u.username === user.username).length > 0 || userProfile.collabRequestsSent.filter(u => u.username === profileToCollab.username).length > 0){

        userProfile.collabRequestsSent = userProfile.collabRequestsSent.filter((reqSent)=>{
          return reqSent.userId !== profileToCollab.user;
        });
      
        profileToCollab.collabRequestsRecieved = profileToCollab.collabRequestsRecieved.filter((reqRecieve)=>{
          return reqRecieve.userId !== user.id;
        });

        await profileToCollab.save();
        await userProfile.save();
        return res.json({ success: true, msg: "Cancelled your collab request with " + profileToCollab.username });
      }
        profileToCollab.collabRequestsRecieved.push({userId: user.id, username:user.username, title:req.body.title, description:req.body.title, date:Date.now()});
        userProfile.collabRequestsSent.push({userId: profileToCollab.user, username:profileToCollab.username, title:req.body.title, description:req.body.title, date:Date.now()});
        await profileToCollab.save();
        await userProfile.save();
        return res.json({ success: true, msg: "Your collab request to " + profileToCollab.username + " has been sent" });
      } catch (err) {
        console.error(err.message);
        res.status(500).json({errors: { server: 'Server error' }});
    }
});

// @route    POST api/collabs/status
// @desc     Change status of collab request(accept or decline)
// @access   Private
router.post('/status', auth, async (req, res) => {
  const { errors, isValid } = validateCollabRequest(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    let user = req.user!
    const userProfile  = await Profile.findOne({user:user.id});
    if (!userProfile ) {
      return res.status(400).json({errors: { collabs: "You do not have a profile yet" }});
    }
    // find user they want to accept
    const collabToAccept = await Profile.findOne({username:req.body.username});
    if(!collabToAccept)  return res.status(400).json({errors: { collabs: 'We could not find the profile you wanted to accept' }});
    if(collabToAccept.username === user.username) return res.status(400).json({errors: { collabs: 'You cannot collab with yourself' }});

    if(userProfile.collabRequestsRecieved.filter(u => u.username === collabToAccept.username).length === 0 || collabToAccept.collabRequestsSent.filter(u => u.username === user.username).length === 0 ) return res.status(400).json({errors: { collabRequestsRecieved: "You haven't recieved a collab request from this user"}});
    
    let collabReq: {userId: String, username: String, title:String, description: String }=  {userId:"", username: "", title: "", description:""};
    userProfile.collabRequestsRecieved = userProfile .collabRequestsRecieved.filter((reqSent)=>{
      if(reqSent.userId === collabToAccept.user)  collabReq = reqSent;
      return reqSent.userId !== collabToAccept.user;
    })
    
    collabToAccept.collabRequestsSent = collabToAccept.collabRequestsSent.filter((reqRecieve)=>{
      return reqRecieve.userId !== user.id;
    })
    if(Boolean(req.body.accept) === true){
        const newCollab = new Collab({
          user1:{
            user:collabToAccept.user,
            username:collabToAccept.username
          },
          user2:{
            user:userProfile.user,
            username:userProfile.username
          },
          title: collabReq.title,
          description: collabReq.description
        });
        newCollab.save();
      userProfile.collabs.push(newCollab._id);
      collabToAccept.collabs.push(newCollab._id);
      await collabToAccept.save();
      await userProfile .save();
      return res.json({ success: true, msg: `You sucessfully accepted ${req.body.username}'s collab request` });
    }
    await collabToAccept.save();
    await userProfile .save();
    return res.json({ success: true, msg: `You sucessfully denied ${req.body.username}'s collab request` });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({errors: { server: 'Server error' }});
  }
});




// // @route    POST api/collabs/unfriend
// // @desc     cancel collab with user user
// // @access   Private
// router.post('/cancel-collab', auth, async (req, res) => {
//   const { errors, isValid } = validateCollabRequest(req.body);
//   if (!isValid) {
//     return res.status(400).json(errors);
//   }
// try {
//   let user = req.user!
//   const userCollab = await Collab.findOne({user:user.id});
//   if (!userCollab) {
//     return res.status(400).json({errors: { friends: "You do not have a friend's list yet" }});
//   }
//   // find user they want to unfriend
//   const collabToCancel = await Collab.findOne({username:req.body.username});
//   if(!collabToCancel)  return res.status(400).json({errors: { collabs: 'We could not find the collab you wanted to cancel' }});
//   if(collabToCancel.username === user.username) return res.status(400).json({errors: { collabs: 'You cannot have a collab to cancel' }});

//   if(collabToCancel.collabs.filter(u => u.username === user.username).length === 0 || userCollab.collabs.filter(u => u.username === collabToCancel.username).length === 0){
//     return res.status(400).json({errors:{collabs: "You do not have a collab with this user yet"}})
//   }


//   userCollab.collabs = userCollab.collabs.filter((collab)=>{
//     return collab.userId !== collabToCancel.user;
//   })

//   collabToCancel.collabs = collabToCancel.collabs.filter((collab)=>{
//     return collab.userId !== user.id;
//   })
//   await collabToCancel.save();
//   await userCollab.save();

//   return res.json({ success: true, msg: "You have sucessfully canceled the collab with " + collabToCancel.username });
// } catch (err) {
//   console.error(err.message);
//   res.status(500).json({errors: { server: 'Server error' }});
// }
// });
export default router