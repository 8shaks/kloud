import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import validateCollabRequest from "../../validation/friendRequest"
import Conversation from "../../models/Conversation";
import Profile from "../../models/Profile";
import Message from "../../models/Message";
import { IProfile, IConversation, IMessage } from "../../@types/custom";
import { getFile, uploadFile } from '../../utils/fileFuncs';
const multer = require("multer");
// const { keys } = require("../../config/keys");

// const fs = require('fs');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//   accessKeyId: keys.accessKeyId,
//   secretAccessKey: keys.secretAccessKey
// });
// @route    GET api/my convos
// @desc     Get all a users conversations
// @access   Private
// function getMyConvos(profile:IProfile):Promise<any>{
//   return new Promise<IConversation[]>((resolve, reject) => {
//     let myConversations:IConversation[] = [];
//     if (profile.conversations.length === 0)  resolve(myConversations) 
//     profile!.conversations.forEach(async (conversationUserObj) => {
//       let conversation = await Conversation.findById(conversationUserObj.conversationId);
//       if (conversation) myConversations.push(conversation);
//       if (myConversations.length === profile!.conversations.length){
//         resolve(myConversations.sort((a, b) => { return new Date(b.date).getTime() - new Date(a.date).getTime()}));
//       }
//     });
//   });
// }
// router.get('/myconvos', auth, async (req, res) => {
//   if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});

//   try {
//     const profile = await Profile.findOne({user:req.user.id});

//     if(!profile) return res.status(400).json({errors: { profile: 'Cannot find your profile' }});
//     getMyConvos(profile).then((myConversations)=>{
//       return res.json(myConversations)
//     })
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });


// // @route    GET api/messages/:id
// // @desc     Get all a conversation's messages
// // @access   Private
// // const testFunc = (msg:IMessage, element:any, i:any) => {
// //   return new Promise<any>((resolve, reject) => {
// //     getFile(element).then((el)=>{
// //       msg.files[i] = {file: el, fileName:msg.files[i].fileName};
// //       return resolve(true)
// //      })
// //   });
// // }

router.get('/messages/:id', auth, async  (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
 
  try {
  
    let messages = await Message.find({conversationId: req.params.id}).sort({ date: 1 });

    return res.json({messages})

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/lastMessage/:conversationId', auth, async  (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
 
  try {
  
    let message = await Message.find({conversationId: req.params.conversationId}).limit(1).sort({ date: 1 });

    return res.json({message})

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.post("/changeMessageStatus", auth, async (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});
  try {
    console.log("Yo")
    let message = await Message.findById(req.body.message._id);
    if(!message) return res.status(404).json({errors: { message: 'Message not found' }});
    message.read = true;
    await message.save();
    return res.json({message})

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // MAKE A FILE UPLOAD ENDPOINT

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 },
//   fileFilter: function(req:any, file:any, cb:() => void) {
//     checkFileType(file, cb);
//   }
// });
// router.post(
//   "/upload", upload.single("image"), (req, res) => {
//     let file = {};
//     return res.json({success})
//     console.log("success")
//   }
// );


// @route    POST api/messages/file/:id
// @desc     Get download link for file
// @access   Private
// router.post('/file', auth, async  (req, res) => {
  
//   if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});

//   if( typeof req.body.conversationId !== 'string' || typeof req.body.fileLoc !== "string" ) return res.status(400).json({errors: { conversation: 'Invalid request' }});
//   try {
//     const profile = await Profile.findOne({user:req.user.id});
//     if (!profile) return res.status(400).json({errors: { profile: 'Could not find your profile' }});
//     if(profile.conversations.filter(c => c.conversationId === req.body.conversationId).length === 0 ) return res.status(400).json({errors: { conversation: "No matching conversation"}});
  
//     getFile(req.body.fileLoc).then((el)=>{
//       res.setHeader('content-type', 'application/octet-stream')
//       res.setHeader('content-disposition', "test.mp3")
//       return res.send(el)
//      }).catch((err) => {
//         console.log(err)
//         return res.status(500).json({errors: { server: "There was a server error"}})
//      })

   
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });



export default router