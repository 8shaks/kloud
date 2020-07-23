import Head from 'next/head';
import postStyles from"../posts.module.scss";
import Layout from '../../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getPost, deletePost } from '../../../redux/actions/postActions';
import { sendCollabReq, getProfileById } from '../../../redux/actions/profileActions';
import React, { useState, useEffect, FormEvent } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router'
import { PostType, ProfileType } from "../../../@types/customType"
import axios from "axios";
import CollabReqModal from "../../../components/my-collabs/collabReqModal";

interface Props{
  auth: {isAuthenticated: boolean, user:{ user:{id:string, username: string}}},
  errors: any,
  posts:{posts:PostType[], post:PostType},
  loading:boolean,
  getPost:any,
  deletePost: any,
  sendCollabReq: (username:string, title: string, description:string) => void,
  getProfileById:(id:string) => void,
  profile: {profile: ProfileType}
}
interface collabError{
  title:null|string,
  description:null|string,
  server? : null|string
}
const Post = (props:Props) => {
  const router = useRouter()
  const { id } = router.query
  const [myPost, setPostStatus] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [collabStatus, setStatus] = useState({ collabRequestSent: false, collabInProgress: false,  collabRequestReceieved: false });
  const [collabModal, setCollabModal] = useState(false);
  const [collabReqInfo, setCollabReqInfo] = useState({title:"", description:""})
  const [collabReqErrors, setCollabReqErrors] = useState<collabError>({ title:null, description:null, server:null});

  useEffect(() => {
    if(props.profile.profile !==null){
      if(props.profile.profile.collabRequestsSent.filter(u => u.username === props.auth.user.user.username ).length === 1){
        setStatus({...collabStatus, collabRequestReceieved:true});
      }
      if(props.profile.profile.collabRequestsRecieved.filter(u => u.username === props.auth.user.user.username ).length === 1){
        setStatus({...collabStatus, collabRequestSent:true});
      }
      if(props.profile.profile.collabs.filter(u => u.username === props.auth.user.user.username ).length === 1){
        setStatus({...collabStatus, collabInProgress:true});
      }
    }

  }, [props.profile])

  useEffect(() => {
     if(typeof id === "string"){
        props.getPost(id);
      }
  }, [])
  useEffect(() => {
    if(props.auth.isAuthenticated){
      if(props.posts.post.user ===  props.auth.user.user.id){
        setPostStatus(true);
      }
      props.getProfileById(props.posts.post.user);
    }
  }, [props.posts.post])

  const deletePost = () => {
    if(props.auth.user.user.id === props.posts.post.user){
      props.deletePost(id);
    }else{
      setAuthError(true);
    }
  }

  const toggleModal = () => {
    setCollabModal(!collabModal);
  }

  const checkCollabReqInfo = () => {
    let errorsNew:collabError = {description:null, title: null};
    collabReqInfo.description.length > 300 || collabReqInfo.description.length < 20 ? errorsNew.description = "Please enter a description between 300 and 20 characters" : null;
    collabReqInfo.title.length > 100 || collabReqInfo.title.length < 10 ? errorsNew.title = "Please enter a title between 100 and 10 characters" : null;
    setCollabReqErrors(errorsNew);
    if (!errorsNew.title  && !errorsNew.description && !errorsNew.server) return true;
    else return false
  }
  
  const sendCollabReq = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(checkCollabReqInfo()){
    props.sendCollabReq(props.profile.profile.username,collabReqInfo.title, collabReqInfo.description);
    }
  }
  const cancelCollabRequest = () =>{
    props.sendCollabReq(props.profile.profile.username, "sd", "sd");
  }

  
  const onCollabReqChange = (e: React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLTextAreaElement>) => {
    setCollabReqInfo({...collabReqInfo, [e.target.name]: e.target.value})
  }
  let postContent = <div className={postStyles.page}>Loading...</div>
  let editPost, collabButton;


  if (props.auth.isAuthenticated){
    
    if(!collabStatus.collabRequestSent && props.posts.post.user !== props.auth.user.user.id && !collabStatus.collabInProgress && !collabStatus.collabRequestReceieved){
      collabButton = (
        <button className={postStyles.startCollab} onClick={toggleModal}>Send Collab Request</button>
      )
    }else if(collabStatus.collabRequestSent){
      collabButton = (
        <button className={postStyles.endCollab} onClick={cancelCollabRequest}>Cancel Collab Request</button>
      )
    }else if(collabStatus.collabRequestReceieved){
      collabButton = (
        <Link href="/my-collabs"><a className={postStyles.startCollab} >View Collab Request</a></Link>
      )
    }else if(collabStatus.collabInProgress) {
      collabButton = (
        <Link href="/collabs"><a className={postStyles.startCollab}>View Collab</a></Link>
      )
    }
    if(myPost){
      editPost = (
        <div className={postStyles.friendSection}>
          <Link href={`/posts/${props.posts.post._id}/edit`}><a className={postStyles.editPostButton}>Edit Post</a></Link><button className={postStyles.removePostButton} onClick={deletePost}>Delete Post</button>
        </div>
      )
    }
  }
  
  if(props.posts.post !== null){
    const { post } = props.posts
    postContent = (
      <div className={postStyles.page}> 
        <h1 className={postStyles.heading}>
          {post.title} 
          <Link href={`/profiles/username/${post.username}`}><a >{post.username}</a></Link>
        </h1>
        <div className={postStyles.content}>
          <span className={postStyles.genre}>{post.genre}</span>
          <br/>
          <p className={postStyles.description}>{post.description}</p>
          {editPost}
          {authError ? <span className={postStyles.error}>You do not own this post!</span> : null}
          {collabButton}
          {collabModal ? <CollabReqModal toggleModal={toggleModal} username={props.profile.profile.username} onChange={onCollabReqChange} onSubmit={sendCollabReq} collabReqInfo={collabReqInfo} errors={collabReqErrors}/> : null}
        </div>
      </div>);
    }
    return (
        <Layout>
          {postContent}
        </Layout>
  )
}


const mapStateToProps = (state:Props) => ({
  auth: state.auth,
  posts: state.posts,
  errors: state.errors,
  loading: state.loading,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getPost, deletePost, sendCollabReq, getProfileById}
)(Post);