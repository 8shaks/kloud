import mongoose from 'mongoose'
// import { IUser } from './User'
const Schema = mongoose.Schema;
import { IMessage } from '../@types/custom';

const MessageSchema = new Schema({
    sender:{
        required:true,
        type:String
    },
    content:{
        required:true,
        type:String
    },
    conversationId:{
        required:true,
        type:String
    },
    date: {
        type: Date,
        default: Date.now
    },
    read:{
        required:true,
        type:Boolean
    }
});



const Message = mongoose.model<IMessage>("messages", MessageSchema);
export default Message;