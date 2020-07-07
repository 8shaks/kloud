import mongoose from 'mongoose'
// import { IUser } from './User'
const Schema = mongoose.Schema;
import { IConversation } from '../@types/custom';

const ConversationSchema = new Schema({
  participants:[String],
  collabId: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
  }
});



const Conversation = mongoose.model<IConversation>("conversations", ConversationSchema);
export default Conversation;