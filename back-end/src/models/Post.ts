import mongoose from 'mongoose'
// import { IUser } from './User'
const Schema = mongoose.Schema;
import { IPost } from '../@types/custom';

const PostSchema = new Schema({
  user: {
      type: String,
      required:true
  },
  username:{
    type: String,
    required:true
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



const Post = mongoose.model<IPost>("post", PostSchema);
export default Post;