import mongoose from 'mongoose'
// import { IUser } from './User'
const Schema = mongoose.Schema;
import { IFriend } from '../@types/custom';

const FriendSchema = new Schema({
  user: {
      type: String,
      required:true
  },
  username:{
    type: String,
    required:true
  },
  friends: [{
    userId:{
      type:String,
      required:true
    },
    username:{
      type:String,
      required:true
    },
    date: {
        type: Date,
        default: Date.now
      }
  }],
  friendRequestsRecieved:[{userId: String, username: String }],
  friendRequestsSent:[{userId: String, username: String }],
});



const Friend = mongoose.model<IFriend>("friend", FriendSchema);
export default Friend;