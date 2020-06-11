import express from 'express'
import { IProfile } from '../../@types/custom';
const router = express.Router();
import auth from '../../middleware/auth';
import validateFriendRequest from "../../validation/friendRequest"
import Profile from "../../models/Profile"
import Friend from "../../models/Friend"
// FIND OBJECT IN ARRAY AND DELETE

// @route    GET api/friends
// @desc     Get all a users friends
// @access   Private
router.get('/', auth, async (req, res) => {
  const { errors, isValid } = validateFriendRequest(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
try {
  let user = req.user!
  const userFriend = await Friend.findOne({user:user.id});
  if (!userFriend) {
    return res.status(400).json({errors: { friends: "You do not have a friend's list" }});
  }
  //Return all of a user's friends
  return res.json({ success: true, friends: userFriend.friends });
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
    const userFriend = await Friend.findOne({user:user.id});
    if (!userFriend) {
      return res.status(400).json({errors: { friends: "You do not have a friend's list" }});
    }
    // find user they want to send request to
    const friendtoAdd = await Friend.findOne({username:req.body.username});
    if(!friendtoAdd)  return res.status(400).json({errors: { friends: 'We could not find the friend you wanted to add' }});
    if(friendtoAdd.username === user.username) return res.status(400).json({errors: { friends: 'You cannot add yourself' }});

    if(friendtoAdd.friendRequestsRecieved.filter(u => u.username === user.username).length > 0 || userFriend.friendRequestsSent.filter(u => u.username === friendtoAdd.username).length > 0){

      userFriend.friendRequestsSent = userFriend.friendRequestsSent.filter((reqSent)=>{
        return reqSent.userId !== friendtoAdd.user;
      })
    
      friendtoAdd.friendRequestsRecieved = friendtoAdd.friendRequestsRecieved.filter((reqRecieve)=>{
        return reqRecieve.userId !== user.id;
      })

      await friendtoAdd.save();
      await userFriend.save();
      return res.json({ success: true, msg: "Cancelled your friend request" });
    }
    friendtoAdd.friendRequestsRecieved.push({userId: user.id, username:user.username});
    userFriend.friendRequestsSent.push({userId: friendtoAdd.user, username:friendtoAdd.username});


    await friendtoAdd.save();
    await userFriend.save();
    return res.json({ success: true, msg: "Your friend message to " + friendtoAdd.username +" has been succesfully sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({errors: { server: 'Server error' }});
  }
});

// @route    POST api/friends/status
// @desc     Change status of friend request(accept or decline)
// @access   Private
router.post('/status', auth, async (req, res) => {
  const { errors, isValid } = validateFriendRequest(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    let user = req.user!
    const userFriend = await Friend.findOne({user:user.id});
    if (!userFriend) {
      return res.status(400).json({errors: { friends: "You do not have a friend's list yet" }});
    }
    // find user they want to accept
    const friendtoAccept = await Friend.findOne({username:req.body.username});
    if(!friendtoAccept)  return res.status(400).json({errors: { friends: 'We could not find the friend you wanted to add' }});
    if(friendtoAccept.username === user.username) return res.status(400).json({errors: { friends: 'You cannot add yourself' }});

    if(userFriend.friendRequestsRecieved.filter(u => u.username === friendtoAccept.username).length === 0 || friendtoAccept.friendRequestsSent.filter(u => u.username === user.username).length === 0 ) return res.status(400).json({errors: { friendRequestRecieved: "You haven't recieved a friend request from this user"}});
    
    userFriend.friendRequestsRecieved = userFriend.friendRequestsRecieved.filter((reqSent)=>{
      return reqSent.userId !== friendtoAccept.user;
    })
  
    friendtoAccept.friendRequestsSent = friendtoAccept.friendRequestsSent.filter((reqRecieve)=>{
      return reqRecieve.userId !== user.id;
    })
    if(Boolean(req.body.accept) === true){
      userFriend.friends.push({userId: friendtoAccept.user, username:friendtoAccept.username});
      friendtoAccept.friends.push({userId: user.id, username:user.username});
      await friendtoAccept.save();
      await userFriend.save();
      return res.json({ success: true, msg: `You sucessfully accepted ${req.body.username}'s friend request` });
    }
    await friendtoAccept.save();
    await userFriend.save();
    return res.json({ success: true, msg: `You sucessfully denied ${req.body.username}'s friend request` });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({errors: { server: 'Server error' }});
  }
});




// @route    POST api/friends/unfriend
// @desc     unfriend user
// @access   Private
router.post('/unfriend', auth, async (req, res) => {
  const { errors, isValid } = validateFriendRequest(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
try {
  let user = req.user!
  const userFriend = await Friend.findOne({user:user.id});
  if (!userFriend) {
    return res.status(400).json({errors: { friends: "You do not have a friend's list yet" }});
  }
  // find user they want to unfriend
  const friendtoUnfriend = await Friend.findOne({username:req.body.username});
  if(!friendtoUnfriend)  return res.status(400).json({errors: { friends: 'We could not find the friend you wanted to unfriend' }});
  if(friendtoUnfriend.username === user.username) return res.status(400).json({errors: { friends: 'You cannot unfriend yourself' }});

  if(friendtoUnfriend.friends.filter(u => u.username === user.username).length === 0 || userFriend.friends.filter(u => u.username === friendtoUnfriend.username).length === 0){
    return res.status(400).json({errors:{friends: "You are not friends with this user"}})
  }


  userFriend.friends = userFriend.friends.filter((friend)=>{
    return friend.userId !== friendtoUnfriend.user;
  })

  friendtoUnfriend.friends = friendtoUnfriend.friends.filter((friend)=>{
    return friend.userId !== user.id;
  })
  await friendtoUnfriend.save();
  await userFriend.save();

  return res.json({ success: true, msg: "You have sucessfully unfriended this user" });
} catch (err) {
  console.error(err.message);
  res.status(500).json({errors: { server: 'Server error' }});
}
});
export default router