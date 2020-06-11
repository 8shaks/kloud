import mongoose from 'mongoose'
// import { IUser } from './User'
const Schema = mongoose.Schema;
import { ICollab } from '../@types/custom';

const CollabSchema = new Schema({
  user: {
      type: String,
      required:true
  },
  username:{
    type: String,
    required:true
  },
  collabs: [{
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
  collabRequestsRecieved:[{userId: String, username: String }],
  collabRequestsSent:[{userId: String, username: String }],
});



const Collab = mongoose.model<ICollab>("collab", CollabSchema);
export default Collab;