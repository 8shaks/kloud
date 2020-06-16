import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import validateFriendRequest from "../../validation/friendRequest"
import Collab from "../../models/Collab";



// @route    GET api/collabs
// @desc     Get all a users collabs
// @access   Private
router.get('/', auth, async (req, res) => {
    const { errors, isValid } = validateFriendRequest(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
  try {
    let user = req.user!
    const userCollab = await Collab.findOne({user:user.id});
    if (!userCollab) {
      return res.status(400).json({errors: { collabs: "You do not have a collab's list" }});
    }
    //Return all of a user's collabs
    return res.json({ success: true, collabs: userCollab.collabs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({errors: { server: 'Server error' }});
  }
});
// @route    POST api/friends/send_req
// @desc     Send a friend Request to a user
// @access   Private
router.post('/send_req', auth, async (req, res) => {
    const { errors, isValid } = validateFriendRequest(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
  try {
    let user = req.user!
    const userCollab = await Collab.findOne({user:user.id});
    if (!userCollab) {
      return res.status(400).json({errors: { collabs: "You do not have a collab's list" }});
    }
    // find user they want to send request to
    const collabToAdd = await Collab.findOne({username:req.body.username});
    if(!collabToAdd)  return res.status(400).json({errors: { collabs: 'We could not find the user you wanted to collab with' }});
    if(collabToAdd.username === user.username) return res.status(400).json({errors: { collabs: 'You cannot collab with yourself' }});

    if(collabToAdd.collabRequestsRecieved.filter(u => u.username === user.username).length > 0 || userCollab.collabRequestsSent.filter(u => u.username === collabToAdd.username).length > 0){

      userCollab.collabRequestsSent = userCollab.collabRequestsSent.filter((reqSent)=>{
        return reqSent.userId !== collabToAdd.user;
      })
    
      collabToAdd.collabRequestsRecieved = collabToAdd.collabRequestsRecieved.filter((reqRecieve)=>{
        return reqRecieve.userId !== user.id;
      })

      await collabToAdd.save();
      await userCollab.save();
      return res.json({ success: true, msg: "Cancelled your collab request with " + collabToAdd.username });
    }
    collabToAdd.collabRequestsRecieved.push({userId: user.id, username:user.username});
    userCollab.collabRequestsSent.push({userId: collabToAdd.user, username:collabToAdd.username});


    await collabToAdd.save();
    await userCollab.save();
    return res.json({ success: true, msg: "Your collab request to " + collabToAdd.username + " has been sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({errors: { server: 'Server error' }});
  }
});

// @route    POST api/collabs/status
// @desc     Change status of collab request(accept or decline)
// @access   Private
router.post('/status', auth, async (req, res) => {
  const { errors, isValid } = validateFriendRequest(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    let user = req.user!
    const userCollab = await Collab.findOne({user:user.id});
    if (!userCollab) {
      return res.status(400).json({errors: { collabs: "You do not have a collab's list yet" }});
    }
    // find user they want to accept
    const collabToAccept = await Collab.findOne({username:req.body.username});
    if(!collabToAccept)  return res.status(400).json({errors: { collabs: 'We could not find the collab you wanted to add' }});
    if(collabToAccept.username === user.username) return res.status(400).json({errors: { collabs: 'You cannot add yourself' }});

    if(userCollab.collabRequestsRecieved.filter(u => u.username === collabToAccept.username).length === 0 || collabToAccept.collabRequestsSent.filter(u => u.username === user.username).length === 0 ) return res.status(400).json({errors: { friendRequestRecieved: "You haven't recieved a collab request from this user"}});
    
    userCollab.collabRequestsRecieved = userCollab.collabRequestsRecieved.filter((reqSent)=>{
      return reqSent.userId !== collabToAccept.user;
    })
  
    collabToAccept.collabRequestsSent = collabToAccept.collabRequestsSent.filter((reqRecieve)=>{
      return reqRecieve.userId !== user.id;
    })
    if(Boolean(req.body.accept) === true){
      userCollab.collabs.push({userId: collabToAccept.user, username:collabToAccept.username});
      collabToAccept.collabs.push({userId: user.id, username:user.username});
      await collabToAccept.save();
      await userCollab.save();
      return res.json({ success: true, msg: `You sucessfully accepted ${req.body.username}'s collab request` });
    }
    await collabToAccept.save();
    await userCollab.save();
    return res.json({ success: true, msg: `You sucessfully denied ${req.body.username}'s collab request` });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({errors: { server: 'Server error' }});
  }
});




// @route    POST api/collabs/unfriend
// @desc     cancel collab with user user
// @access   Private
router.post('/cancel-collab', auth, async (req, res) => {
  const { errors, isValid } = validateFriendRequest(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
try {
  let user = req.user!
  const userCollab = await Collab.findOne({user:user.id});
  if (!userCollab) {
    return res.status(400).json({errors: { friends: "You do not have a friend's list yet" }});
  }
  // find user they want to unfriend
  const collabToCancel = await Collab.findOne({username:req.body.username});
  if(!collabToCancel)  return res.status(400).json({errors: { collabs: 'We could not find the collab you wanted to cancel' }});
  if(collabToCancel.username === user.username) return res.status(400).json({errors: { collabs: 'You cannot have a collab to cancel' }});

  if(collabToCancel.collabs.filter(u => u.username === user.username).length === 0 || userCollab.collabs.filter(u => u.username === collabToCancel.username).length === 0){
    return res.status(400).json({errors:{collabs: "You do not have a collab with this user yet"}})
  }


  userCollab.collabs = userCollab.collabs.filter((collab)=>{
    return collab.userId !== collabToCancel.user;
  })

  collabToCancel.collabs = collabToCancel.collabs.filter((collab)=>{
    return collab.userId !== user.id;
  })
  await collabToCancel.save();
  await userCollab.save();

  return res.json({ success: true, msg: "You have sucessfully canceled the collab with " + collabToCancel.username });
} catch (err) {
  console.error(err.message);
  res.status(500).json({errors: { server: 'Server error' }});
}
});
export default router