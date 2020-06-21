import Head from 'next/head';
import collabStyles from"./collab.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getCurrentProfile, changeCollabRecStatus } from '../../redux/actions/profileActions'
import React, { useState, useEffect, FormEvent, Fragment } from 'react';
import Router from 'next/router';
import CollabCard from "../../components/collabs/collabCard";
import CollabRecCard from "../../components/collabs/collabRecCard";
import { CollabType, ProfileType } from "../../@types/customType"
import axios from "axios";

interface Props{
  auth: {isAuthenticated: boolean, user:{ user:{ id:string, username: string}}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  // profile:{profile: any, profiles:[any], isLoading:boolean },
//  loginUser:  ({username, password}: loginError) => void,
  getCurrentProfile:() => void,
  changeCollabRecStatus : (collabReq:{username:string, accept:boolean}) => void
}
const Profile = (props:Props) => {
    // const host = "http://localhost:5000";
    const host="";
    const [myCollabs, setMyCollabs] = useState<CollabType[]>([])
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
          })
        }
      }

    }, [props.profile.profile])

    let collabContent = <div className={collabStyles.page}>Loading...</div>

    let  collabs, collabRecs;
    if(props.profile.profile !== null){
      const { profile } = props.profile;
      if(profile.collabs.length > 0){
        collabs=(
            <Fragment>
              <h2 id="collabs">Collabs</h2>
              {
                myCollabs.map((myCollab)=>{
                  if (myCollab.user1.userId === props.auth.user.user.id) return <CollabCard date={myCollab.date} user={myCollab.user1} collaborator={myCollab.user2} _id={myCollab._id} title={myCollab.title} description={myCollab.description}/>
                  else  return <CollabCard date={myCollab.date} user={myCollab.user2} collaborator={myCollab.user1} _id={myCollab._id} title={myCollab.title} description={myCollab.description}/>
                })
              }
            </Fragment>

        )
      }else{
        collabs = (
            <span className={collabStyles.heading}>Head to your <Link href="/profiles/me#friends"><a>friends list</a></Link> and start a collab!</span>
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
      collabContent = (
        <div className={collabStyles.page}> 
          <h1 className={collabStyles.heading}>Welcome {profile.username}</h1>
          <div className={collabStyles.collabs}>
            <div className={collabStyles.collabRequestsRecieved}>
              <h2>Collab Requests Received</h2>
              {collabRecs}
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
  { getCurrentProfile, changeCollabRecStatus }
)(Profile);