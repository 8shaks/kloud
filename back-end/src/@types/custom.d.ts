import mongoose from 'mongoose'

export interface IProfile extends mongoose.Document {
  user: string,
  username:string,
  bio?: string,
  social: {
    youtube?:string,
    twitter?:string,
    instagram?:string,
    facebook?:string,
    soundcloud?:string
  },
  credits?: string[],
  collabs:{collabId:string, username:string}[],
  posts:string[],
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
  collabRequestsRecieved:{
    userId:string,
    username:string,
    title: string,
    description: string,
    date:number
  } [],
  collabRequestsSent:{
    userId:string,
    username:string,
    title: string,
    description: string,
    date:number
  }[],
  conversations:{date?:string, conversationId:string, username:string}[],
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

export interface IPost extends mongoose.Document {
  user: string,
  username:string,
  title:string,
  description:string,
  date:Date
  // leave the company field

}

export interface ICollab extends mongoose.Document {
  user1:{
    user:string,
    username:string
  },
  user2:{
    user:string,
    username:string
  },
  title: string,
  description: string,
  conversation:string,
  files:{
    fileName:string,
    fileKey:string,
    date?:string
  }[],
  date?:Date
}

export interface IConversation extends mongoose.Document{
  _doc: ConversationType;
  date?,
  participants:string[],
  _id:string,
  collabId?:string,
  lastMessage?:IMessage,
  lastActive:number
}
export interface ConversationType {
  date?,
  participants:string[],
  _id:string,
  collabId?:string,
  lastMessage?:IMessage,
  lastActive:number
}
export interface IMessage extends mongoose.Document{
  date?,
  sender:string,
  content:string,
  conversationId:string,
  read:boolean
}
export interface SocketMessage extends mongoose.Document{
  date?,
  sender:string,
  content:string,
  conversationId:string,
}