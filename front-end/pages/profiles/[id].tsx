import Head from 'next/head';
import profileStyles from"./profile.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getProfileById, unfriendUser, changeFriendReqStatus, sendFriendReq, sendCollabReq, clearProfile } from '../../redux/actions/profileActions';
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { ProfileType, PostType } from "../../@types/customType";
import axios from "axios";
import PostCard from "../../components/posts/postCard"
import CollabReqModal from "../../components/my-collabs/collabReqModal";
import host from "../../vars";


interface Props{
  auth: {isAuthenticated: boolean, user:{ user:{id:string, username: string}}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  unfriendUser: (username:string) => void,
  sendFriendReq: (username:string) => void,
  clearProfile: () => void,
  sendCollabReq: (username:string, title: string, description:string) => void,
  changeFriendReqStatus:(friendReq:{username:string, accept:boolean}) => void,
  // profile:{profile: any, profiles:[any], isLoading:boolean },
//  loginUser:  ({username, password}: loginError) => void,
  getProfileById:(username:string) => void
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
    const [collabStatus, setStatus] = useState({ collabRequestSent: false, collabInProgress: false,  collabRequestReceieved: false });
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
      if(props.profile.profile !== null){
        if(props.profile.profile.posts.length > 0){
          axios.get(`${host}/api/posts/user/${props.profile.profile.user}`).then((res)=>{
            setUserPosts(res.data)
          })
        }
        if(props.auth.isAuthenticated){
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
      }

    }, [props.profile.profile])
    
    useEffect(() => {
      return setErrors(props.errors);
    }, [props.errors])

    useEffect(() => {
      return () => {
        clearProfile();
      }
    }, [])


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

    const onCollabReqChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      setCollabReqInfo({...collabReqInfo, [e.target.name]: e.target.value})
    }
 
    let profileContent = <div className={profileStyles.page}>Loading...</div>
    let userPostsContent, collabButton;
  
    if(props.profile.profile !== null){
      const { profile } = props.profile
      let socialLinks;

      if(props.auth.isAuthenticated){
        if(!collabStatus.collabRequestSent && profile.user !== props.auth.user.user.id && !collabStatus.collabInProgress && !collabStatus.collabRequestReceieved){
          collabButton = (
            <button className={profileStyles.addFriendButton} onClick={toggleModal}>Send Collab Request</button>
          )
        }else if(collabStatus.collabRequestSent){
          collabButton = (
            <button className={profileStyles.removeFriendButton} onClick={cancelCollabRequest}>Cancel Collab Request</button>
          )
        }else if(collabStatus.collabRequestReceieved){
          collabButton = (
            <Link href="/my-collabs"><a className={profileStyles.addFriendButton} >View Collab Request</a></Link>
          )
        }else if(collabStatus.collabInProgress) {
          collabButton = (
            <Link href="/collabs"><a className={profileStyles.addFriendButton}>View Collab</a></Link>
          )
        }
      }
  
      if(profile.posts.length > 0){
        userPostsContent=(
          <div className={profileStyles.myPosts}>
          <h2>{profile.username} Posts</h2>
            {
              userPosts.map((userPost)=>{
                return <PostCard key={userPost._id} genre={userPost.genre} user={userPost.user} username={userPost.username} _id={userPost._id} title={userPost.title} description={userPost.description}/>
              })
            }
          </div>
        )
      }

      if (profile.social){
        socialLinks=(
          <div className={profileStyles.socialLinks}>
            {profile.social.youtube ? <a target="_blank" href={profile.social.youtube}><img className={profileStyles.socialLogo} alt="Youtube" src={"/images/youtube.png"}/></a> : null}
            {profile.social.soundcloud ? <a target="_blank" href={`https://www.soundcloud.com/${profile.social.soundcloud}`}><img className={profileStyles.socialLogo} alt="Soundcloud" src={"/images/soundcloud.png"}/></a> : null}
            {profile.social.twitter ? <a target="_blank" href={`https://www.twitter.com/${profile.social.twitter}`}><img className={profileStyles.socialLogo} alt="Twitter" src={"/images/twitter.png"}/></a> : null}
            {profile.social.instagram ? <a target="_blank" href={`https://www.instagram.com/${profile.social.instagram}`}><img className={profileStyles.socialLogo} alt="Instagram" src={"/images/instagram.png"}/></a> : null}
            {profile.social.beatstars ? <a target="_blank" href={`https://www.beatstars.com/${profile.social.beatstars}`}><img className={profileStyles.socialLogo} alt="Beatstars"  src={"/images/beatstars.png"}/></a> : null}
          </div>
        )
      }

        profileContent = (
          <div className={profileStyles.page}> 
            <div className={profileStyles.banner}>
              <div className={profileStyles.bannerImageCont}>
                {profile.bannerImage && profile.bannerImage !== "" ? <img className={profileStyles.profileImage} src={`https://kloud-banners.s3.us-east-2.amazonaws.com/${profile.user}/${profile.bannerImage}`}/> : null}
                <h1>{profile.username}</h1>
              </div>
              {socialLinks}
            </div>
            {collabButton}
            {collabModal ? <CollabReqModal toggleModal={toggleModal} username={profile.username} onChange={onCollabReqChange} onSubmit={sendCollabReq} collabReqInfo={collabReqInfo} errors={collabReqErrors}/> : null}
            <div className={profileStyles.bioCont}>
              <p className={profileStyles.bio}>
                {profile.bio}
              </p>
            </div>
            <div className={profileStyles.shareProfile}><span>https://kloud.live/profiles/{profile.user}</span><button onClick={() => {navigator.clipboard.writeText(`https://kloud.live/profiles/${props.auth.user.user.id}`)}}>Copy Link</button></div>
            {userPostsContent}
          </div>
        );
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
  { getProfileById, unfriendUser, changeFriendReqStatus, sendFriendReq, sendCollabReq, clearProfile }
)(Profile);