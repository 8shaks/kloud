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
import { ProfileType, profileError, social, PostType } from "../../@types/customType"
import axios from "axios";
import io from "socket.io-client";
import host from "../../vars"


interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  // profile:{profile: any, profiles:[any], isLoading:boolean },
//  loginUser:  ({username, password}: loginError) => void,
  getCurrentProfile:() => void,
}
const Messages = (props:Props) => {
    const [profile, setProfile] = useState(props.profile.profile);
 

    let socket = io(host)

    useEffect(() => {
      if(!props.loading){
        if (!props.auth.isAuthenticated ) Router.push('/');
        else props.getCurrentProfile();
      }
    }, [props.loading])

    useEffect(() => {
      if(!props.loading){
        setProfile(props.profile.profile);
      }
    }, [props.profile.profile])

    let messagesContent = <div className={messagesStyles.page}>Loading...</div>

    if(profile !== null){
      messagesContent = (
      <div className={messagesStyles.page}> 
        <h1 className={messagesStyles.heading}>Messages </h1>
        <div className={messagesStyles.chatContainer}>
          <div className={messagesStyles.leftBar}>
            <div className={messagesStyles.personToChat}>
              username
            </div>
          </div>
        </div>
      </div>
      );
    }
    return (
        <Layout>
          {messagesContent}
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