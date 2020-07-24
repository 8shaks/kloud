import Head from 'next/head';
import collabStyles from"./collab.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getCurrentProfile, changeCollabRecStatus, sendCollabReq } from '../../redux/actions/profileActions'
import React, { useState, useEffect, FormEvent, Fragment } from 'react';
import Router from 'next/router';
import CollabCard from "../../components/my-collabs/collabCard";
import CollabRecCard from "../../components/my-collabs/collabRecCard";
import CollabReqCard from "../../components/my-collabs/collabReqCard";
import { CollabType, ProfileType } from "../../@types/customType"
import axios from "axios";
import host from "../../vars"

interface Props{
  auth: {isAuthenticated: boolean, user:{ user:{ id:string, username: string}}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  // profile:{profile: any, profiles:[any], isLoading:boolean },
//  loginUser:  ({username, password}: loginError) => void,
  getCurrentProfile:() => void,
  sendCollabReq:(username:string, title:string, description:string) => void,
  changeCollabRecStatus : (collabReq:{username:string, accept:boolean}) => void
}
const Profile = (props:Props) => {
    const [myCollabs, setMyCollabs] = useState<CollabType[]>([]);

    useEffect(() => {
      if(!props.loading){
        if (!props.auth.isAuthenticated ) Router.push('/');
        else props.getCurrentProfile();
      }
    }, [props.loading])
    useEffect(() => {
      if (props.profile.profile) {
        if(props.profile.profile.collabs.length > 0){
          axios.get(`${host}/api/collabs/mycollabs`).then((res)=>{
            setMyCollabs(res.data)
          }).catch((err)=>{
            console.log(err)
          })
        }
      }
    }, [props.profile.profile])

    let collabContent = <div className={collabStyles.page}>Loading...</div>

    let  collabs, collabRecs, collabReqs;
    if(props.profile.profile !== null){
      const { profile } = props.profile;
      if(profile.collabs.length > 0){
        collabs=(
            <Fragment>
              <h2 id="collabs">Collabs</h2>
              {
                myCollabs.map((myCollab)=>{
                  if (myCollab.user1.user === props.auth.user.user.id){
                    return <CollabCard key={myCollab._id} date={myCollab.date} user={myCollab.user2} collaborator={myCollab.user1} _id={myCollab._id} title={myCollab.title} description={myCollab.description} notification={myCollab.notification}/>
                  }
                  else{
                    return <CollabCard key={myCollab._id} date={myCollab.date} user={myCollab.user1} collaborator={myCollab.user2} _id={myCollab._id} title={myCollab.title} description={myCollab.description} notification={myCollab.notification}/>
                  }
                })
              }
            </Fragment>

        )
      }
      if(profile.collabRequestsRecieved.length > 0){
        collabRecs = (
        <Fragment>
          {profile.collabRequestsRecieved.map((collabRec)=>{
              return <CollabRecCard changeCollabRecStatus={props.changeCollabRecStatus} date={collabRec.date} collaborator={{username:collabRec.username, userId:collabRec.userId}} title={collabRec.title} description={collabRec.description}/>
          })}
        </Fragment>
        )
      }else{
        collabRecs = (
          <Fragment>
            <span>None Yet :(</span>
          </Fragment>
          )
      }
      if(profile.collabRequestsSent.length > 0){
        collabReqs = (
        <Fragment>
          {profile.collabRequestsSent.map((collabRec)=>{
              return <CollabReqCard cancelCollabReq={props.sendCollabReq} date={collabRec.date} collaborator={{username:collabRec.username, userId:collabRec.userId}} title={collabRec.title} description={collabRec.description}/>
          })}
        </Fragment>
        )
      }else{
        collabReqs = (
          <Fragment>
            <span>None Yet :(</span>
          </Fragment>
          )
      }
      collabContent = (
        <div className={collabStyles.page}> 
        <div className={collabStyles.heading}>
          <h1 >Welcome {profile.username}</h1>
          <h3>Here you can manage your collabs. Checkout what collabs you have currently going on, who has sent you a request, and any pending requests you have sent.</h3>
        </div>
          <div className={collabStyles.collabs}>
            <h2 className={collabStyles.myCollabsLink}><Link href="/collabs"><a>View Collab Chat and Files</a></Link></h2>
            <div className={collabStyles.collabRequestsRecieved}>
              <h2>Collab Requests Received</h2>
              {collabRecs}
            </div>
            <div className={collabStyles.collabRequestsRecieved}>
              <h2>Collab Requests Sent</h2>
              {collabReqs}
            </div>
            <div className={collabStyles.collabsList}>
              {collabs}
            </div>
          </div>
        </div>
        );


    }

    return (
        <Layout>
          {collabContent}
        </Layout>
  )
}


const mapStateToProps = (state:Props) => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, changeCollabRecStatus, sendCollabReq }
)(Profile);