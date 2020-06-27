import Head from 'next/head';
import messagesStyles from"./messages.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getCurrentProfile, createProfile, unfriendUser, changeFriendReqStatus } from '../../redux/actions/profileActions'
import React, { useState, useEffect, FormEvent, Fragment } from 'react';
import Router from 'next/router';
import FriendReqCard from "../../components/profile/friendReqCard";
import FriendCard from "../../components/profile/friendCard";
import SocialLinksForm from "../../components/profile/socialLinksForm";
import { ProfileType, ConversationType, social, PostType , MessageType} from "../../@types/customType"
import axios from "axios";
import io from "socket.io-client";
import host from "../../vars"
import MessagesScreen from "../../components/collabs/messagesScreen"
// import MessagesScreen from '../../components/collabs/messagesScreen';


interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  // profile:{profile: any, profiles:[any], isLoading:boolean },
//  loginUser:  ({username, password}: loginError) => void,
  getCurrentProfile:() => void,
}

const socket = io(host);
const Messages = (props:Props) => {
    const [profile, setProfile] = useState(props.profile.profile);
    const [friendListStatus, changeFriendListStatus] = useState(false);
    const [conversations, setConversations] = useState<ConversationType[]>([]);
    const [currentConvo, setCurrentConvo] = useState<{userToChat:string, message:string, messages:MessageType[], files:FileList | null}>({userToChat:"", message:"", messages:[], files:null});

    useEffect(() => {
      if(!props.loading){
        if (!props.auth.isAuthenticated ) Router.push('/');
        else {
          axios.get(`${host}/api/conversations/myconvos`).then((res)=>{
            setConversations(res.data)
          })
          props.getCurrentProfile();
        }
      }
    }, [props.loading])

    useEffect(() => {
      if(!props.loading && props.profile.profile){
        setProfile(props.profile.profile);
        props.profile.profile.conversations.forEach((convo) => {
          socket.emit("join", convo.conversationId);
        })
      }
      return () => {
        // socket.emit('disconnect')
        socket.off('disconnect');
      }
    }, [props.profile.profile])

    useEffect(() => {
      socket.on("message", ({message}: {message:MessageType}) => {
        setCurrentConvo({...currentConvo, messages:[...currentConvo.messages, message]})
      })
    }, [currentConvo])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
      setCurrentConvo({...currentConvo, message:e.target.value});
    }
    const sendMessage = (e: React.MouseEvent<HTMLButtonElement>)  => {
      e.preventDefault();
      if(currentConvo.message || currentConvo.files){
        setCurrentConvo({...currentConvo, message:""});
        console.log( currentConvo.files![0])
        let test_array = []
        if(currentConvo.files){
          for(let i = 0; i < currentConvo.files.length; i++){
            var reader = new FileReader();
            reader.readAsArrayBuffer(currentConvo.files[i]);
          }
        }
        console.log(currentConvo)
        socket.emit("chat", {profile:profile, userToChat:currentConvo.userToChat, message: currentConvo.message, files: currentConvo.files});
      }
    }
    const toggleFriendList = () => {
      changeFriendListStatus(!friendListStatus);
    }
    const onChangeFile =  (e: React.ChangeEvent<HTMLInputElement>) => setCurrentConvo({...currentConvo, files:e.target.files});

    const chatStart = ( e:any) => {
      if (e.currentTarget.textContent){
        let temp_array = conversations;
        temp_array.unshift({participants:[profile.username, e.currentTarget.textContent]})
        setConversations(temp_array);
        toggleFriendList();
        setCurrentConvo({message:"", userToChat: e.currentTarget.textContent, messages:[], files:null})
      }
    }
    const chatFriend = ( username:string, convoId?:string ) => {
        axios.get(`${host}/api/conversations/messages/${convoId}`).then((res) => {
          setCurrentConvo({message:"", userToChat: username.trim(), messages:res.data.messages, files:null});
        })
    }
    let messagesContent = <div className={messagesStyles.page}>Loading...</div>
    let friendsList;
    if(profile !== null){
      friendsList = (
        <div className={messagesStyles.friendsList}>
          <span onClick={toggleFriendList} className={messagesStyles.close} >&times;</span>
          {profile.friends.map((friend)=>{
            return <div className={messagesStyles.friendCard}><span onClick={chatStart}>{friend.username}</span></div>
          })}
        </div>
      )

      messagesContent = (
      <div className={messagesStyles.page}> 
        <h1 className={messagesStyles.heading}>Collabs</h1>
        <div className={messagesStyles.chatContainer}>
          <ul className={messagesStyles.leftBar}>
            {conversations.map((convo)=>{
              const userChat = convo.participants[0] !== profile.username ? convo.participants[0] : convo.participants[1];
              return <li className={convo.participants.includes(currentConvo.userToChat) ? messagesStyles.personToChat + " " + messagesStyles.selectedConvo : messagesStyles.personToChat} key={convo._id} onClick={() => {chatFriend(userChat, convo._id)}}> {userChat}</li>
            })}
            <button onClick={toggleFriendList} className={messagesStyles.newConversation}>New Convo</button>
          </ul>
          <div className={messagesStyles.chat}>
            <MessagesScreen messages={currentConvo.messages} user={profile.username}/>
            <div className={messagesStyles.input_group}> 
              <form >
              <input className={messagesStyles.messageInput} onChange={onChange} aria-label="Message" value={currentConvo.message} name="Message" placeholder="Send a message"/>
              <input className={messagesStyles.fileInput} type="file"  onChange={onChangeFile}  name="Files" />
              <button onClick={sendMessage}>Send</button>
              </form>
            </div>
          </div>
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


const mapStateToProps = (state: { loading: boolean, profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean}, auth: {isAuthenticated: boolean, user:{ id:string, username: string}}; errors: any; }) => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { getCurrentProfile}
)(Messages);