import mongoose from 'mongoose'
// import { IUser } from './User'
const Schema = mongoose.Schema;
import { ICollab } from '../@types/custom';

const CollabSchema = new Schema({
  user1: {
      user:{
        type: String,
        required:true
      },
      username:{
        type: String,
        required:true
      }
  },
  user2: {
    user:{
      type: String,
      required:true
    },
    username:{
      type: String,
      required:true
    }
  },
  title:{
    type: String,
    required:true
  },
  description:{
    type: String,
    required:true
  },
  date: {
    type: Date,
    default: Date.now
  }
});



const Collab = mongoose.model<ICollab>("collab", CollabSchema);
export default Collab;