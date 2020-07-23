import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import validateCollabRequest from "../../validation/friendRequest";
import Collab from "../../models/Collab";
import Profile from "../../models/Profile";
import User from "../../models/User";
import { IProfile, ICollab, IConversation, ConversationType } from "../../@types/custom";
import { storage, checkFileType, uploadFile, getFile } from "../../utils/fileFuncs";
import Conversation from '../../models/Conversation';
import Message from '../../models/Message';
import multer from "multer";
import { profile } from 'console';
const keys = require("../../config/keys");
import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  ignoreTLS: false,
  secure: false,
  auth: {
    user: keys.email,
    pass: keys.emailPassword
  }
});

const emailCollabReq = `
Hey [username]!
<br/><br/>
It looks you have received a request for collaboration! Visit the link below, decide whether or not you would like to work with the person who accepted your request, and start collaborating!
<br/><br/>
<a href="https://kloud.live/my-collabs" target="_blank"> Click here to see the Collab</a>
<br/><br/>
From,<br/>
The Kloud Team
`



// @route    GET api/collabs
// @desc     Get all a users collabs
// @access   Private
function getMyCollabs(profile:IProfile):Promise<any>{
  return new Promise<ICollab[]>((resolve, reject) => {
    let myCollabs:ICollab[] = [];
    if (profile.collabs.length === 0)  resolve(myCollabs) 
    profile!.collabs.forEach(async (collabObj) => {
      let collab = await Collab.findById(collabObj.collabId);
      
      if (collab){
        let lastMessage = await Message.find({conversationId: collab.conversation}).limit(1).sort({ date: -1 });
        if (lastMessage.length === 0)  myCollabs.push(collab)
        else{
          if (!lastMessage[0].read && profile.username !== lastMessage[0].sender) collab.notification = true;
          else collab.notification = false;
          myCollabs.push(collab);
        }
      }
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

// @route    GET api/my convos
// @desc     Get all a users conversations
// @access   Private
function getMyConvos(collabs:ICollab[]):Promise<any>{
  return new Promise<ConversationType[]>((resolve, reject) => {
    let myConversations:ConversationType[] = [];
    if (collabs.length === 0)  resolve(myConversations) 
    collabs.forEach(async (collabObj) => {
      let conversation = await Conversation.findById(collabObj.conversation);

      if (conversation) {
        let lastMessage = await Message.find({conversationId: conversation._id}).limit(1).sort({ date: -1 });
        let conversationObj:ConversationType;
        if(lastMessage) {
          conversationObj = {...conversation._doc, lastMessage:lastMessage[0]}
          myConversations.push(conversationObj);
        }else{
          myConversations.push(conversation);
        }
      }

      if (myConversations.length === collabs.length){
        resolve(myConversations.sort((a, b) => { return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()}));
      }
    });
  });
}

router.get('/collabconvos', auth, async (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
  // return res.json({conversations:[]})
  try {
    const profile = await Profile.findOne({user:req.user.id});
    if(!profile) return res.status(400).json({errors: { profile: 'Cannot find your profile' }});
    getMyCollabs(profile).then((myCollabs)=>{
      return getMyConvos(myCollabs).then((myConversations)=>{
        return res.json({colabs:myCollabs, convos:myConversations})
      })
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

// @route    GET api/collabs/:collab_id
// @desc     Getcollab by Id
// @access   Private
router.get('/getcollab/:collab_id', auth, async (req, res) => {
    if (!req.user) return res.status(400).json({ errors: {user: 'Valid user required'} });
    try {
      const collab = await Collab.findById(req.params.collab_id);
      
      if (!collab) return res.status(400).json({ errors: {collab: 'Collab not found'} });
      if (collab.user1.user !== req.user.id && collab.user2.user !== req.user.id) return res.status(400).json({ errors: {collab: 'You are not in this collab'} });
      return res.json(collab);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);


const upload = multer();

// @route    POST api/messages/file/:id
// @desc     Get download link for file
// @access   Private
router.post('/upload_file/:collab_id', auth, upload.single("file"),  async  (req, res) => {
  
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});

  if( typeof req.params.collab_id !== 'string' ) return res.status(400).json({errors: { collabs: 'Invalid request' }});
  try {
    const collab = await Collab.findById(req.params.collab_id);
    if (!collab) return res.status(400).json({ errors: {collab: 'Collab not found'} });
    if (collab.user1.user !== req.user.id && collab.user2.user !== req.user.id) return res.status(400).json({ errors: {collab: 'You are not in this collab'} });
    if(checkFileType(req.file) && req.file.size <= 10000000){
      await uploadFile(req.file, req.params.collab_id);

      collab.files.push({fileName:req.file.originalname, fileKey:`${req.params.collab_id}/${req.file.originalname}` })
      collab.save();

      return res.json({sucess:true, msg:"File sucesfully uploaded"})
    }else{
      return res.status(400).json({errors:{fileType:"Invalid File Type"}});
    }
   
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/messages/file/:id
// @desc     Get download link for file
// @access   Private
router.post('/getfile', auth, upload.single("file"),  async  (req, res) => {
  
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});

  if( typeof req.body.collab_id !== 'string' || typeof req.body.fileName !== 'string') return res.status(400).json({errors: { collabs: 'Invalid request' }});
  try {
    const collab = await Collab.findById(req.body.collab_id);
    if (!collab) return res.status(400).json({ errors: {collab: 'Collab not found'} });

    if (collab.user1.user !== req.user.id && collab.user2.user !== req.user.id) return res.status(400).json({ errors: {collab: 'You are not in this collab'} });
   getFile(`${req.body.collab_id}/${req.body.fileName}`).then((el)=>{
      res.setHeader('content-type', 'application/octet-stream')
      res.setHeader('content-disposition', "test.mp3")
      return res.send(el)
     }).catch((err) => {
        console.log(err)
        return res.status(500).json({errors: { server: "There was a server error"}})
     })

  } catch (err) {
    console.error(err);
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
      if(profileToCollab.collabs.filter(u => u.username === userProfile.username).length > 0) return res.status(400).json({errors: { collabs: 'You already have a collab with this user'  }});
      if(profileToCollab.collabRequestsSent.filter(u => u.username === userProfile.username).length > 0) return res.status(400).json({errors: { collabs: 'This user has already sent you a collab request'  }});
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
        
        const userToCollab =  await User.findOne({username:req.body.username});
        const mailOptions = {
          from: "Kloud",
          to: userToCollab!.email,
          subject: "New Collab Request",
          //Email to Be sent
          html: emailCollabReq.replace("[username]",profileToCollab.username )
        };
        console.log(keys)
        //Send Email
        transporter.sendMail(mailOptions, function(err, info) {
          //handle email errors
          if (err) console.log(err);
          else console.log(info);
        });

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
    // console.log(req.body)
    if(collabToAccept.username === user.username) return res.status(400).json({errors: { collabs: 'You cannot collab with yourself' }});
    if(userProfile.collabRequestsRecieved.filter(u => u.username === collabToAccept.username).length === 0 || collabToAccept.collabRequestsSent.filter(u => u.username === user.username).length === 0 ) return res.status(400).json({errors: { collabRequestsRecieved: "You haven't recieved a collab request from this user"}});
    
    let collabReq: {userId: String, username: String, title:String, description: String } =  {userId:"", username: "", title: "", description:""};
    userProfile.collabRequestsRecieved = userProfile .collabRequestsRecieved.filter((reqSent)=>{
      if(reqSent.userId === collabToAccept.user)  collabReq = reqSent;
      return reqSent.userId !== collabToAccept.user;
    })
    
    collabToAccept.collabRequestsSent = collabToAccept.collabRequestsSent.filter((reqRecieve)=>{
      return reqRecieve.userId !== user.id;
    })

    if(Boolean(req.body.accept) === true){
      const conversation = await new Conversation({participants:[userProfile.username,collabToAccept.username]})
      
      const newCollab = await new Collab({
        user1:{
          user:collabToAccept.user,
          username:collabToAccept.username
        },
        user2:{
          user:userProfile.user,
          username:userProfile.username
        },
        title: collabReq.title,
        description: collabReq.description,
        conversation: conversation._id
      });
      conversation.collabId = newCollab._id;
      newCollab.save();
      userProfile.collabs.push({collabId:newCollab._id, username:collabToAccept.username});
      collabToAccept.collabs.push({collabId:newCollab._id, username:userProfile.username});
      conversation.save();

      const emailCollabAccepted = `
      Hey ${collabToAccept.username}!
      <br/><br/>
      The collab request you sent to ${userProfile.username} has been accepted! Visit the link below to start your collaboration.
      <br/><br/>
      <a href="https://kloud.live/collabs/${newCollab._id}" target="_blank"> Click here to see the Collab</a>
      <br/><br/>
      From,<br/>
      The Kloud Team
      `
      const userToAccept =  await User.findOne({username:collabToAccept.username});
      const mailOptions = {
        from: "Kloud",
        to: userToAccept!.email,
        subject: `${userProfile.username} accepted your request!`,
        //Email to Be sent
        html: emailCollabAccepted
      };
      //Send Email
      transporter.sendMail(mailOptions, function(err, info) {
        //handle email errors
        if (err) console.log(err);
        else console.log(info);
      });

      await collabToAccept.save();
      await userProfile.save();
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