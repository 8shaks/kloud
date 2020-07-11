export interface ProfileType {
  user: string,
  username:string,
  bio?: string,
  social: {
    youtube?:string,
    twitter?:string,
    instagram?:string,
    beatstars?:string,
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
  _id:string,
  date:Date
}
export interface CollabType{
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
  notification?: boolean,
  files:{
    fileName:string,
    fileKey:string,
    date?:number
  }[],
  _id:string,
  date:number
}
  
export interface profileError{
    bio?:string| null, 
    social?:{
      youtube?:string| null, 
      twitter?:string| null, 
      instagram?:string| null, 
      soundcloud?:string| null, 
      beatstars?:string| null, 
    }|null,
    server:string|null
}
  
export interface social{
    youtube?:string,
    twitter?:string,
    instagram?:string,
    beatstars?:string,
    soundcloud?:string
}

export interface PostType {
  user: string,
  username:string,
  title:string,
  description:string,
  date:Date,
  genre:string,
  _id:string

}

export interface ConversationType {
  date?,
  participants:string[]
  _id:string,
  collabId?:string,
  lastMessage:MessageType,
  lastActive:number
}
export interface MessageType{
  date?,
  sender:string,
  content:string,
  conversationId:string,
  read:boolean
}