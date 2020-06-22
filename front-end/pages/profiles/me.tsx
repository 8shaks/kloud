import Head from 'next/head';
import profileStyles from"./profile.module.scss";
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
import PostCard from "../../components/posts/postCard"
import host from "../../vars"

interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  unfriendUser: (username:string) => void,
  changeFriendReqStatus:(friendReq:{username:string, accept:boolean}) => void,
  // profile:{profile: any, profiles:[any], isLoading:boolean },
//  loginUser:  ({username, password}: loginError) => void,
  getCurrentProfile:() => void,
  createProfile:(profile:ProfileType) => void
}
const Profile = (props:Props) => {
    const [profile, setProfile] = useState(props.profile.profile);
    const [social, setSocial] = useState<social>({youtube: "", twitter:"", soundcloud:"", instagram:"", facebook:""});
    const [errors, setErrors] = useState<profileError>({ bio:null, social: null, server: null});
    const [myPosts, setMyPosts] = useState<PostType[]>([]);

    useEffect(() => {
      if(!props.loading){
        if (!props.auth.isAuthenticated ) Router.push('/');
        else props.getCurrentProfile();
      }
    }, [props.loading])
    useEffect(() => {
      if (props.profile.profile) {
        setProfile(props.profile.profile);
        props.profile.profile.social ? setSocial(props.profile.profile.social) : null;
        if(props.profile.profile.posts.length > 0){
          axios.get(`${host}/api/posts/user/${props.profile.profile.user}`).then((res)=>{
            setMyPosts(res.data)
          })
        }
      }

    }, [props.profile.profile])

    const urlRegex =  new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
    
    const checkValid = () =>{
      let errorsNew:profileError = {bio:null, social:null, server:null};
      if(profile.bio){
        profile.bio.length > 300 ? errorsNew.bio = "Please enter a bio below 300 characters" : null;
      }
      if(profile.social){
        if(social.youtube && social.youtube.length !== 0){
          !urlRegex.test(social.youtube) ? errorsNew.social!.youtube = "Please enter a valid youtube url" : null
        }
        if(social.twitter && social.twitter.length !== 0){
          !urlRegex.test(social.twitter) ? errorsNew.social!.twitter = "Please enter a valid twitter url" : null
        }
        if(social.soundcloud && social.soundcloud.length !== 0){
          !urlRegex.test(social.soundcloud) ? errorsNew.social!.soundcloud = "Please enter a valid soundcloud url" : null
        }
        if(social.facebook && social.facebook.length !== 0){
          !urlRegex.test(social.facebook) ? errorsNew.social!.facebook = "Please enter a valid facebook url" : null
        }
        if(social.instagram && social.instagram.length !== 0){
          !urlRegex.test(social.instagram) ? errorsNew.social!.instagram = "Please enter a valid instagram url" : null
        }
      }
      setErrors(errorsNew);
      if (!errors.social  && !errors.bio && !errors.server) return true
      else return false
    }
    const onSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(checkValid()){
            profile.social = social
            props.createProfile(profile);
        }
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) =>{
      setProfile({...profile, [e.target.name]: e.target.value});
    }
    const onChangeSocial = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) =>{
      setSocial({...social, [e.target.name]: e.target.value});
    }
    let profileContent = <div className={profileStyles.page}>Loading...</div>
    // if(profile === null && !props.loading){
    //   profileContent = <div className={profileStyles.page}>Login to make a profile!</div>
    // }
    let myPostsContent, friends, friendRecs;

    if(profile !== null){
      if(props.profile.profile.posts.length > 0){
        myPostsContent=(
          <div className={profileStyles.myPosts}>
          <h2>My Posts</h2>
            {
              myPosts.map((myPost)=>{
                return <PostCard user={myPost.user} username={myPost.username} _id={myPost._id} title={myPost.title} description={myPost.description}/>
              })
            }
          </div>
        )
      }
      // Friend Recs Cards
      if(profile.friendRequestsRecieved.length > 0){
        console.log(profile)
        friendRecs = (
        <Fragment>
          {profile.friendRequestsRecieved.map((friendRec)=>{
             return <FriendReqCard changeFriendReqStatus={props.changeFriendReqStatus} userId={friendRec.userId} username={friendRec.username}/>
          })}
        </Fragment>
        )
      }else{
        friendRecs = (
          <Fragment>
            <span>None Yet :(</span>
          </Fragment>
          )
      }
      // Friends Cards
      if(profile.friends.length > 0){
        friends = (
        <Fragment>
          {profile.friends.map((friendRec)=>{
             return <FriendCard unfriendUser={props.unfriendUser} userId={friendRec.userId} username={friendRec.username}/>
          })}
        </Fragment>
        )
      }else{
        friends = (
          <Fragment>
            <span>None Yet :(</span>
          </Fragment>
          )
      }
      profileContent = (
      <div className={profileStyles.page}> 
        <h1 className={profileStyles.heading}>Welcome {profile.username}</h1>
        <form className={profileStyles.form}  method="POST" onSubmit={onSubmit}>
          <label>Bio</label>
          <textarea onChange={onChange} aria-label="Bio" value={profile.bio} name="bio" placeholder="Give us some info about your self!"/>
          {<span className="error">{errors.bio}</span>}
          <SocialLinksForm onChange={onChangeSocial} errors={errors.social ? errors.social : {}} social={social} />
          <button>Save Profile</button>
        </form>
        <div className={profileStyles.friends}>
          <div className={profileStyles.friendRequestsRecieved}>
            <h2>Friend Requests Received</h2>
            {friendRecs}
          </div>
          <div className={profileStyles.friendsList}>
            <h2 id="friends">Friends</h2>
            {friends}
          </div>
          <Link href="/collabs/my-collabs"><a>Check your collabs</a></Link>
        </div>
        {myPostsContent}
      </div>
      );
    }
    return (
        <Layout>
          {profileContent}
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
  { getCurrentProfile, createProfile, unfriendUser, changeFriendReqStatus }
)(Profile);