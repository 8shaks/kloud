import mongoose from 'mongoose'
// import { IUser } from './User'
const Schema = mongoose.Schema;
import { IMessage } from '../@types/custom';

const MessageSchema = new Schema({
    sender:String,
    content:String,
    conversationId:String,
    files:[{file:String, fileName:String}],
    date: {
        type: Date,
        default: Date.now
    }
});



const Message = mongoose.model<IMessage>("messages", MessageSchema);
export default Message;