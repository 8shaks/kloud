import mongoose from 'mongoose'

export interface IProfile extends mongoose.Document {
  user: string,
  username:string,
  bio?: string,
  social: {
    youtube?:string,
    twitter?:string,
    instagram?:string,
    facebook?:string
  },
  credits?: string[],
  friends:{
    userId:string,
    username:string
  }[],
  friendRequestsRecieved:{
    userId:string,
    username:string
  } [],
  friendRequestsSent:{
    userId:string,
    username:string
  }[],
  date:Date

}

export interface IUser extends mongoose.Document {
  // user: string,
  email: string,
  username:string,
  password: string,
  date:Date
  // leave the company field

}

export interface IFriend extends mongoose.Document {
  user: string,
  username:string,
  friends:{
    userId:string,
    username:string,
    date?:Date
  }[],
  friendRequestsRecieved:{
    userId:string,
    username:string
  } [],
  friendRequestsSent:{
    userId:string,
    username:string
  }[],
}

export interface ICollab extends mongoose.Document {
  user: string,
  username:string,
  collabs:{
    userId:string,
    username:string,
    date?:Date
  }[],
  collabRequestsRecieved:{
    userId:string,
    username:string
  } [],
  collabRequestsSent:{
    userId:string,
    username:string
  }[],
}