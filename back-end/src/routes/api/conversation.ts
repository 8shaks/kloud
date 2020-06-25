import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth';
import validateCollabRequest from "../../validation/friendRequest"
import Conversation from "../../models/Conversation";
import Profile from "../../models/Profile";
import Message from "../../models/Message";
import { IProfile, IConversation, IMessage } from "../../@types/custom"


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


router.get('/messages/:id', auth, async  (req, res) => {
  if( !req.user ) return res.status(400).json({errors: { user: 'Invalid User' }});

  try {
    // const conversation = await Conversation.findById(req.params.id);
    const messages = await Message.find({conversationId: req.params.id}).sort({ date: 1 });
    if(messages.length === 0) return res.status(400).json({errors: { conversation: 'Cannot find your Conversation' }});
    return res.json({messages});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router