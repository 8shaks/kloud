import Head from 'next/head';
import profileStyles from"./profile.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getProfileById, unfriendUser, changeFriendReqStatus, sendFriendReq, sendCollabReq } from '../../redux/actions/profileActions'
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { ProfileType, PostType } from "../../@types/customType";
import axios from "axios";
import PostCard from "../../components/posts/postCard"
import CollabReqModal from "../../components/collabs/collabReqModal";

interface Props{
  auth: {isAuthenticated: boolean, user:{ user:{id:string, username: string}}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  unfriendUser: (username:string) => void,
  sendFriendReq: (username:string) => void,
  sendCollabReq: (username:string, title: string, description:string) => void,
  changeFriendReqStatus:(friendReq:{username:string, accept:boolean}) => void,
  // profile:{profile: any, profiles:[any], isLoading:boolean },
//  loginUser:  ({username, password}: loginError) => void,
  getProfileById:any
}

interface friendError{
  friends:null|string,
  server:null|string
}
interface collabError{
  title:null|string,
  description:null|string,
  server? : null|string
}

const Profile = (props:Props) => {
    const router = useRouter()
    const { id } = router.query
    const [friendStatus, setStatus] = useState({ friend:false, friendRequestReceived:false, friendRequestSent:false, collabRequestSent: false });
    const [userPosts, setUserPosts] = useState<PostType[]>([])
    const [errors, setErrors] = useState<friendError>({ friends:null, server: null});
    const [collabModal, setCollabModal] = useState(false);
    const [collabReqInfo, setCollabReqInfo] = useState({title:"", description:""})
    const [collabReqErrors, setCollabReqErrors] = useState<collabError>({ title:null, description:null, server:null});
 

    useEffect(() => {
      if(!props.loading){
        if(typeof id === "string"){
          props.getProfileById(id);

        }
      }
    }, [props.loading])
    useEffect(() => {
      if(props.auth.isAuthenticated){
        if(props.profile.profile.friends.filter(u => u.username === props.auth.user.user.username ).length === 1){
          setStatus({...friendStatus, friend:true, friendRequestReceived:false, friendRequestSent:false });
        }else if(props.profile.profile.friendRequestsSent.filter(u => u.username === props.auth.user.user.username ).length === 1){
          setStatus({...friendStatus, friend:false, friendRequestReceived:true, friendRequestSent:false });
        }else if(props.profile.profile.friendRequestsRecieved.filter(u => u.username === props.auth.user.user.username ).length === 1){
          setStatus({...friendStatus, friend:false, friendRequestReceived:false, friendRequestSent:true });
        }
      }
      if(props.profile.profile.collabRequestsRecieved.filter(u => u.username === props.auth.user.user.username ).length === 1){
        setStatus({...friendStatus, collabRequestSent:true});
      }
      if(props.profile.profile !==null){
        if(props.profile.profile.posts.length > 0){
          axios.get(`http://localhost:5000/api/posts/user/${props.profile.profile.user}`).then((res)=>{
            setUserPosts(res.data)
          })
        }
      }

    }, [props.profile.profile])
    useEffect(() => {
      return setErrors(props.errors);
    }, [props.errors])

    const toggleModal = () => {
      setCollabModal(!collabModal);
    }
    const onUnfriend = () =>{
      props.unfriendUser(props.profile.profile.username);
    }
    const sendFriendReq = () =>{
      props.unfriendUser(props.profile.profile.username);
    }

    const checkCollabReqInfo = () => {
      let errorsNew:collabError = {description:null, title: null};
      collabReqInfo.description.length > 300 || collabReqInfo.description.length < 20 ? errorsNew.description = "Please enter a bio below 300 characters" : null;
      collabReqInfo.title.length > 100 || collabReqInfo.title.length < 10 ? errorsNew.title = "Please enter a bio below 300 characters" : null;
      setCollabReqErrors(errorsNew);
      if (!collabReqErrors.title  && !collabReqErrors.description && !collabReqErrors.server) return true
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
    const onAcceptRequest = () =>{
      props.changeFriendReqStatus({username:props.profile.profile.username, accept:true});
    }
    const onDenyRequest = () =>{
      props.changeFriendReqStatus({username:props.profile.profile.username, accept:false});
    }
    const onCollabReqChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
      setCollabReqInfo({...collabReqInfo, [e.target.name]: e.target.value})
    }
 
    let profileContent = <div className={profileStyles.page}>Loading...</div>
    let userPostsContent;
    let friendSection = (
      <div className={profileStyles.friendSection}>
        <Link href="/login" ><a className={profileStyles.addFriendButton}>Chat!</a></Link>
      </div>
    )
    if (props.auth.isAuthenticated && props.auth.user.user.id !== props.profile.profile.user){
      friendSection = (
          <div className={profileStyles.friendSection}>
            <button onClick={sendFriendReq} className={profileStyles.addFriendButton}>Add Friend</button>
            {<span className={profileStyles.error}>{errors.friends}</span>}
            {<span className={profileStyles.error}>{errors.server}</span>}
          </div>
        )
      if(friendStatus.friend){
        friendSection = (
          <div className={profileStyles.friendSection}>
            {!friendStatus.collabRequestSent ? <button className={profileStyles.addFriendButton} onClick={toggleModal}>Start Collab</button> : <button className={profileStyles.removeFriendButton} onClick={cancelCollabRequest}>Cancel Collab Request</button>}
            <button onClick={onUnfriend} className={profileStyles.removeFriendButton}>Remove Friend</button>
            {<span className={profileStyles.error}>{errors.friends}</span>}
            {<span className={profileStyles.error}>{errors.server}</span>}
          </div>
        )
      }
      if(friendStatus.friendRequestSent){
        friendSection = (
          <div className={profileStyles.friendSection}>
            <button onClick={sendFriendReq} className={profileStyles.removeFriendButton}>Cancel Friend Request</button>
            {<span className={profileStyles.error}>{errors.friends}</span>}
            {<span className={profileStyles.error}>{errors.server}</span>}
          </div>
        )
      }
      if(friendStatus.friendRequestReceived){
        friendSection = (
          <div className={profileStyles.friendSection}>
            <button onClick={onAcceptRequest} className={profileStyles.addFriendButton}>Accept Friend Request</button>
            {<span className={profileStyles.error}>{errors.friends}</span>}
            <button onClick={onDenyRequest} className={profileStyles.removeFriendButton}>Deny Friend Request</button>
            {<span className={profileStyles.error}>{errors.friends}</span>}
            {<span className={profileStyles.error}>{errors.server}</span>}
          </div>
        )
      }
    }else if(props.auth.user.user.id === props.profile.profile.user){
      friendSection = <div/>
    }
  
    if(props.profile.profile !== null){
      const { profile } = props.profile
      let socialLinks;
      if(profile.posts.length > 0){
        userPostsContent=(
          <div className={profileStyles.myPosts}>
          <h2>{profile.username} Posts</h2>
            {
              userPosts.map((userPost)=>{
                return <PostCard user={userPost.user} username={userPost.username} _id={userPost._id} title={userPost.title} description={userPost.description}/>
              })
            }
          </div>
        )
      }

      if (profile.social){
        socialLinks=(
          <div className={profileStyles.socialLinks}>
            {profile.social.youtube ? <a target="_blank" href={profile.social.youtube}><a>Youtube</a></a> : null}
            {profile.social.soundcloud ? <a target="_blank" href={profile.social.soundcloud}><a>SoundCloud</a></a> : null}
            {profile.social.twitter ? <a target="_blank" href={profile.social.twitter}><a>Twitter</a></a> : null}
            {profile.social.instagram ? <a target="_blank" href={profile.social.instagram}><a>Instagram</a></a> : null}
            {profile.social.facebook ? <a target="_blank" href={profile.social.facebook}><a>Facebook</a></a> : null}
          </div>
        )
      }
      profileContent = (
        <div className={profileStyles.page}> 
          <h1 className={profileStyles.heading}>{profile.username}</h1>
          <div className={profileStyles.content}>
            {socialLinks}
            <p>{profile.bio}</p>
            {friendSection}
          </div>
          {userPostsContent}
          {collabModal ? <CollabReqModal username={profile.username} onChange={onCollabReqChange} onSubmit={sendCollabReq} collabReqInfo={collabReqInfo} errors={collabReqErrors}/> : null}
        </div>);
    }
    return (
        <Layout>
          {profileContent}
        </Layout>
  )
}


const mapStateToProps = (state: Props) => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { getProfileById, unfriendUser, changeFriendReqStatus, sendFriendReq, sendCollabReq }
)(Profile);