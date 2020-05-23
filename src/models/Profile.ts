import mongoose from 'mongoose'
// import { IUser } from './User'
const Schema = mongoose.Schema;
import { IProfile } from '../@types/custom';

const ProfileSchema = new Schema({
  user: {
      type: String,
      required:true
  },
  username:{
    type: String,
    required:true
  },
  bio: {
    type: String
  },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  credits:[String],
  friends: [{
    userId:{
      type:String,
      required:true
    },
    username:{
      type:String,
      required:true
    }
  }],
  friendRequestsRecieved:[{userId: String, username: String }],
  friendRequestsSent:[{userId: String, username: String }],
  // notifications:[{
  //   type:String,
    
  // }],
  date: {
    type: Date,
    default: Date.now
  }
});



const Profile = mongoose.model<IProfile>("profile", ProfileSchema);
export default Profile;