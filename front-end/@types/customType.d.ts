export interface ProfileType {
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
    date:Date
  }
  
export interface profileError{
    bio?:string| null, 
    social?:{
      youtube?:string| null, 
      twitter?:string| null, 
      instagram?:string| null, 
      soundcloud?:string| null, 
      facebook?:string| null, 
    }|null,
    server:string|null
}
  
export interface social{
    youtube?:string,
    twitter?:string,
    instagram?:string,
    facebook?:string,
    soundcloud?:string
}

export interface PostType {
  user: string,
  username:string,
  title:string,
  description:string,
  date:Date
  _id:string

}