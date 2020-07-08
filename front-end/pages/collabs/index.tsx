import Head from 'next/head';
import messagesStyles from"./messages.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getCurrentProfile} from '../../redux/actions/profileActions';
import React, { useState, useEffect, FormEvent, Fragment } from 'react';
import Router from 'next/router';
import { ProfileType, ConversationType , MessageType} from "../../@types/customType";
import axios from "axios";
import io from "socket.io-client";
import host from "../../vars";
import MessagesScreen from "../../components/collabs/messagesScreen";
import FileInputBox from '../../components/collabs/fileInputBox';
// import MessagesScreen from '../../components/collabs/messagesScreen';


interface Props{
  auth: {isAuthenticated: boolean, user:{ user:{id:string, username: string}}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  getCurrentProfile:() => void,
}

const socket = io(host);
const Messages = (props:Props) => {
    const [profile, setProfile] = useState(props.profile.profile);
    const [friendListStatus, changeFriendListStatus] = useState(false);
    const [conversations, setConversations] = useState<ConversationType[]>([]);
    const [currentConvo, setCurrentConvo] = useState<{userToChat:string, message:string, messages:MessageType[], conversationId:string, collabId:string | undefined}>({userToChat:"", message:"", messages:[], conversationId:"", collabId:undefined});
    // const [lastMessageRead, setReadStatus] = useState(false)
    // const [collabs, setCollabs] = useState<CollabType[]>([]);
    useEffect(() => {
      if(!props.loading){
        if (!props.auth.isAuthenticated ) Router.push('/');
        else {
          axios.get(`${host}/api/collabs/collabconvos`).then((res)=>{ 
            setConversations(res.data.convos);
            res.data.convos.forEach((convo:ConversationType) => {
              socket.emit("join", convo._id);
            })
          })
          props.getCurrentProfile();
        }
      }
      return () => {
        // socket.emit('disconnect')
        socket.off('disconnect');
      }
    }, [props.loading])

    useEffect(() => {
      if(!props.loading && props.profile.profile){
        setProfile(props.profile.profile);
      }
      
    }, [props.profile.profile])


// console.log(currentConvo)
    useEffect(() => {


    }, [currentConvo])

    socket.on("message", ({message}: {message:MessageType}) => {
      // console.log(message)
      if(message.conversationId === currentConvo.conversationId){
        let newMessage = message;
        newMessage.read = true;
        if(message.sender !== props.auth.user.user.username){
          console.log(message)
          axios.post(`${host}/api/conversations/changeMessageStatus`, {message}).then(() => 
             setCurrentConvo({...currentConvo, messages:[...currentConvo.messages, newMessage]})
          );
        }else{
          setCurrentConvo({...currentConvo, messages:[...currentConvo.messages, newMessage]})
        }
        
      }else if(conversations.filter(u => u.lastMessage.content === message.content).length === 0 && conversations.length > 0){
        let newConvo = conversations[conversations.findIndex(x => x._id == message.conversationId)]
        newConvo.lastMessage = message;
         let new_array = conversations.filter((convo)=>{
          return convo._id !== newConvo._id;
        });
        new_array.unshift(newConvo);
        setConversations(new_array);
      }
    });
  

    const onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      setCurrentConvo({...currentConvo, message:e.target.value});
    }
    const sendMessage = (e: React.MouseEvent<HTMLButtonElement>)  => {
      e.preventDefault();
      let newConvo = conversations[conversations.findIndex(x => x._id == currentConvo.conversationId)]
      let new_array = conversations.filter((convo)=>{
        return convo._id !== newConvo._id;
      });
      new_array.unshift(newConvo);
      setConversations(new_array);
      if(currentConvo.message){
        socket.emit("chat", {profile:profile, userToChat:currentConvo.userToChat, message: currentConvo.message, conversationId:currentConvo.conversationId});
        setCurrentConvo({...currentConvo, message:""});
      }
    }

    const screenShare = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      window.open("https://meet.google.com/new?hs=190&utm_source=google&utm_medium=cpc&utm_campaign=na-US-all-en-dr-bkws-all-all-trial-b-dr-1009156&utm_content=text-ad-none-any-DEV_c-CRE_435246731960-ADGP_Hybrid+%7C+AW+SEM+%7C+BKWS+%7E+BMM+%2F%2F+Google+Meet+%2F%2F+Google+Meet-KWID_43700053715469092-kwd-405456583893&utm_term=KW_%2Bmeet+%2Bgoogle-ST_%2Bmeet+%2Bgoogle");
    }
    const toggleFriendList = () => {
      changeFriendListStatus(!friendListStatus);
    }

    const chatFriend = ( username:string, convoId:string, lastMessage:MessageType, collabId?:string) => {
      try{
        if(!lastMessage.read){
          axios.post(`${host}/api/conversations/changeMessageStatus`, {message:lastMessage}).then(() =>{
            axios.get(`${host}/api/conversations/messages/${convoId}`).then((res) => {
              let newConvo = conversations[conversations.findIndex(x => x._id == lastMessage.conversationId)]
              newConvo.lastMessage.read = true;
              let new_array = conversations.filter((convo)=>{
              return convo._id !== newConvo._id;
              });
               new_array.unshift(newConvo);
              setConversations(new_array);
              setCurrentConvo({message:"", userToChat: username.trim(), messages:res.data.messages, conversationId:convoId!, collabId:collabId});
            })
          })
        }else{
          axios.get(`${host}/api/conversations/messages/${convoId}`).then((res) => {
            setCurrentConvo({message:"", userToChat: username.trim(), messages:res.data.messages, conversationId:convoId!, collabId:collabId});
          })
        }
      }catch (err) {
        console.log(err)
      }
    }
    let messagesContent = <div className={messagesStyles.page}>Loading...</div>
    let friendsList;
    
    if(profile !== null){

      messagesContent = (
      <div className={messagesStyles.page}> 
        <h1 className={messagesStyles.heading}>Collabs</h1>
        <div className={messagesStyles.chatContainer}>
          <ul className={messagesStyles.leftBar}>
            {conversations.map((convo)=>{
              const userChat = convo.participants[0] !== profile.username ? convo.participants[0] : convo.participants[1];
              let messageRead;
              if(!convo.lastMessage.read && convo.lastMessage.sender !== profile.username) messageRead = <svg className={messagesStyles.readLogo} height="10" width="10"><circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="red" /></svg>
              return (
                <li className={convo.participants.includes(currentConvo.userToChat) ? messagesStyles.personToChat + " " + messagesStyles.selectedConvo : messagesStyles.personToChat} key={convo._id} onClick={() => {chatFriend(userChat, convo._id, convo.lastMessage, convo.collabId)}}> 
                  {userChat}
                  {messageRead}
                  <div>{convo.lastMessage.content}</div>
                </li>
              )
            })}
            <button onClick={toggleFriendList} className={messagesStyles.newConversation}>New Convo</button>
          </ul>
          {currentConvo.userToChat === "" ? <div className={messagesStyles.collabOnEnter}><h3>Choose a collab to your left</h3></div> : 
          <div className={messagesStyles.chat}>
            <FileInputBox collabId={currentConvo.collabId}/>
            <MessagesScreen messages={currentConvo.messages} user={profile.username}/>
            <div className={messagesStyles.input_group}> 
              <form >
              <input className={messagesStyles.messageInput} onChange={onChange} aria-label="Message" value={currentConvo.message} name="Message" placeholder="Send a message"/>
              <button onClick={sendMessage}>Send</button>
              <button onClick={screenShare}>Share</button>
              </form>
            </div>
          </div>
          }
        </div>
      </div>
      );
    }
    return (
        <Layout>
          {messagesContent}
          {friendListStatus ? <div className={messagesStyles.friendsListModal}>{friendsList}</div> : null}
        </Layout>
  )
}


const mapStateToProps = (state: { loading: boolean, profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean}, auth: {isAuthenticated: boolean, user:{ user: {id:string, username: string}}}; errors: any; }) => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { getCurrentProfile}
)(Messages);