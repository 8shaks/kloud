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
import { ProfileType, ProfileError, social, PostType } from "../../@types/customType";
import axios from "axios";
import PostCard from "../../components/posts/postCard"
import host from "../../vars"
import Axios from 'axios';

interface Props{
  auth: {isAuthenticated: boolean, user:{ user: {id:string, username: string}}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  unfriendUser: (username:string) => void,
  changeFriendReqStatus:(friendReq:{username:string, accept:boolean}) => void,
  getCurrentProfile:() => void,
  createProfile:(profile:ProfileType) => void
}
const Profile = (props:Props) => {
    const [profile, setProfile] = useState<ProfileType>();
    const [social, setSocial] = useState<social>({youtube: "", twitter:"", soundcloud:"", instagram:"", beatstars:""});
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<ProfileError>({ bio:null, social: null, server: null, bannerImage:null});
    const [myPosts, setMyPosts] = useState<PostType[]>([]);
    const [profileSaved, setProfileSaved] = useState(false);
    const [editProfile, setEditProfile] = useState(false);

    useEffect(() => {
        if (!props.auth.isAuthenticated &&  !props.loading) Router.push('/');
        else props.getCurrentProfile();
    }, [props.loading])

    useEffect(() => {
      if (props.profile.profile && !props.loading ) {
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

    const imageChecker = (image:File) => {
      console.log(image.size)
      if (image.size > 36481 || (image.type !== "image/jpeg" && image.type !== "image/jpg" && image.type !== "image/png") ) return false;
      else return true;
    };

    const onChangeImage = (e:any) => setBannerImage(e.target.files[0]);
    
    const uploadBannerImage = () => {
      setProfileSaved(false);
      if(bannerImage){
        if(!imageChecker(bannerImage)){
            const formData = new FormData();
            formData.append("image", bannerImage);
            axios.post(`${host}/api/profile/banner-upload`, formData).then((res) => {
              setErrors({ bio:null, social: null, server: null, bannerImage:null});
              setProfileSaved(true);
            }).catch((err) => {
              console.log(err)
              setErrors({...errors, bannerImage:err.response.data.errors.bannerImage})
            })
        }else setErrors({...errors, bannerImage:"Please upload a valid image(jpg or png) under 10mb"});
      }
    }

    const deleteBannerImage = () => {
      setProfileSaved(false);
      axios.get(`${host}/api/profile/banner-delete`).then((res) => {
        setErrors({ bio:null, social: null, server: null, bannerImage:null});
        setProfileSaved(true);
      }).catch((err) => {
        console.log(err)
        setErrors({...errors, bannerImage:err.response.data.errors.bannerImage})
      })
    }

    const checkValid = () =>{
      let errorsNew:ProfileError = {bio:null, social:null, server:null, bannerImage : null};
      if(profile!.bio){
        profile!.bio.length > 300 ? errorsNew.bio = "Please enter a bio below 300 characters" : null;
      }

      setErrors(errorsNew);
      if ( !errors.bio && !errors.server) return true
      else return false
    }
    const onSubmit = (e: FormEvent<HTMLFormElement>) =>{
      setProfileSaved(false);
        e.preventDefault();
        if(checkValid()){
            profile!.social = social;
            props.createProfile(profile!);
            setProfileSaved(true);
            setEditProfile(false)
        }
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) =>{
      setProfile({...profile!, [e.target.name]: e.target.value});
    }
    const onChangeSocial = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) =>{
      setSocial({...social, [e.target.name]: e.target.value});
    }
    let profileContent = <div className={profileStyles.page}>Loading...</div>

    let myPostsContent, socialLinks;
    
    if(profile){
      if(profile.posts.length > 0){
        myPostsContent=(
          <div className={profileStyles.myPosts}>
          <h2>My Posts</h2>
            {
              myPosts.map((myPost)=>{
                return <PostCard genre={myPost.genre} key={myPost._id} user={myPost.user} username={myPost.username} _id={myPost._id} title={myPost.title} description={myPost.description}/>
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
      if (editProfile){
        profileContent = (
          <div className={profileStyles.page}> 
            <div className={profileStyles.banner}>
              <div className={profileStyles.bannerImageCont}>
              {profile.bannerImage && profile.bannerImage !== "" ? <img className={profileStyles.profileImage} src={`https://kloud-banners.s3.us-east-2.amazonaws.com/${profile.user}/${profile.bannerImage}`}/> : null}
                <h1>{profile.username}</h1>
              </div>
              {socialLinks}
            </div>
            <form className={profileStyles.form}  method="POST" onSubmit={onSubmit}>
              <div>
                <input accept="image/*"  type="file" onChange={onChangeImage} name="Files" />  
                <button onClick={uploadBannerImage} className={profileStyles.imageUpload_button}>Upload Banner</button>{profile.bannerImage ? <button onClick={deleteBannerImage} className={profileStyles.imageDelete_button}>Delete Banner</button> : null}
                <span className={profileStyles.error}>{errors.bannerImage}</span>
              </div>
              <label>Bio</label>
              <textarea onChange={onChange} aria-label="Bio" value={profile.bio} name="bio" placeholder="Give us some info about your self!"/>
              {<span className="error">{errors.bio}</span>}
              <SocialLinksForm onChange={onChangeSocial} errors={errors.social ? errors.social : {}} social={social} />
              <button type="submit">Save Profile</button>
            </form>
            <button className={profileStyles.editProfile} onClick={() => setEditProfile(!editProfile)}>Edit Profile</button>
            {myPostsContent}
          </div>
          );
      }else{
        profileContent = (
          <div className={profileStyles.page}> 
            <div className={profileStyles.banner}>
              <div className={profileStyles.bannerImageCont}>
                {profile.bannerImage && profile.bannerImage !== "" ? <img className={profileStyles.profileImage} src={`https://kloud-banners.s3.us-east-2.amazonaws.com/${profile.user}/${profile.bannerImage}`}/> : null}
                <h1>{profile.username}</h1>
              </div>
              {socialLinks}
            </div>
            {profileSaved ? <span className={profileStyles.profileSaved}>Profile saved</span> : null}
            <div className={profileStyles.bioCont}>
              <p className={profileStyles.bio}>
                {profile.bio}
              </p>
              <button className={profileStyles.editProfile} onClick={() => setEditProfile(!editProfile)}>Edit Profile</button>
            </div>
            <div className={profileStyles.shareProfile}><span>https://kloud.live/profiles/{props.auth.user.user.id}</span><button onClick={() => {navigator.clipboard.writeText(`https://kloud.live/profiles/${props.auth.user.user.id}`)}}>Copy Link</button></div>
            {myPostsContent}
          </div>
          );
      }
      
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
  { getCurrentProfile, createProfile, unfriendUser, changeFriendReqStatus }
)(Profile);