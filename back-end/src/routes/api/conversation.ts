import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import validateCollabRequest from "../../validation/friendRequest"
import Conversation from "../../models/Conversation";
import Profile from "../../models/Profile";
import Message from "../../models/Message";
import { IProfile, IConversation, IMessage } from "../../@types/custom";
import { getFile } from '../../utils/fileFuncs';
import { debug } from 'console';
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
function getMyConvos(profile:IProfile):Promise<any>{
  return new Promise<IConversation[]>((resolve, reject) => {
    let myConversations:IConversation[] = [];
    if (profile.conversations.length === 0)  resolve(myConversations) 
    profile!.conversations.forEach(async (conversationUserObj) => {
      let conversation = await Conversation.findById(conversationUserObj.conversationId);
      if (conversation) myConversations.push(conversation);
      if (myConversations.length === profile!.conversations.length){
        resolve(myConversations.sort((a, b) => { return new Date(b.date).getTime() - new Date(a.date).getTime()}));
      }
    });
  });
}
router.get('/myconvos', auth, async (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});

  try {
    const profile = await Profile.findOne({user:req.user.id});

    if(!profile) return res.status(400).json({errors: { profile: 'Cannot find your profile' }});
    getMyConvos(profile).then((myConversations)=>{
      return res.json(myConversations)
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route    GET api/messages/:id
// @desc     Get all a conversation's messages
// @access   Private
const testFunc = (msg:IMessage, element:any, i:any) => {
  return new Promise<any>((resolve, reject) => {
    console.log(element)
    getFile(element).then((el)=>{
      msg.files[i] = {file: el, fileName:msg.files[i].fileName};
      // console.log(el)
      return resolve(true)
     })
  });
}

router.get('/messages/:id', auth, async  (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});

  try {
    // const conversation = await Conversation.findById(req.params.id);
    let messages = await Message.find({conversationId: req.params.id}).sort({ date: 1 });
    // HAVE TO PUT THIS BLOCK INTO A PROMISE
    // if(messages.length === 0) return res.status(400).json({errors: { conversation: 'Cannot find your Conversation' }});
    console.log(messages)
  
    for(let j = 0; j< messages.length ; j++){
      for(let i = 0; i < messages[j].files.length; i++){
        // console.log("yo")
        await testFunc(messages[j], messages[j].files[i], i)
        // if( j === messages.length-1){
        //   return res.json({messages})
        // }
        if ( j === messages.length -1){
          console.log("yo")
          return res.json({messages})
        }
      }
      if ( j === messages.length -1){
        console.log("yo")
        return res.json({messages})
      }
      // if(){

      // }
      // messages[j].files.forEach(async (element, i) => {
        
      //   await testFunc(messages[j], element, i)
      //   // if( j === messages.length - 1){
    
      //   //   return res.json({messages})
      //   // } 
      // })
    }
    // console.log(messages)

    
    // return res.json({messages});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router