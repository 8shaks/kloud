import Head from 'next/head';
import exploreStyles from"./explore.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getPosts } from '../../redux/actions/postActions';
import { getAllProfiles } from '../../redux/actions/profileActions';
import React, { useState, useEffect } from 'react';
import PostCard from "../../components/posts/postCard";
import ProfileCard from "../../components/profile/profileCard";
import { PostType, ProfileType } from "../../@types/customType";


interface Props {
    auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
    errors: any,
    loading:boolean,
    posts:{post : PostType, posts: PostType[]},
    profile:{ profile: ProfileType, profiles:ProfileType[]}
    getAllProfiles : () => void,
    getPosts:(genre?:string) => void
}
const Explore = (props:Props) => {

    let content;
    const [posts, setPosts] = useState<PostType[]>([]);
    const [profiles, setProfiles] = useState<ProfileType[]>([]); 
    const [postSearch, setPostSearch] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
      props.getPosts();
      props.getAllProfiles();
    },[]);

    useEffect(() => {
      setPosts(props.posts.posts)
    },[props.posts.posts]);

    useEffect(() => {
      setProfiles(props.profile.profiles)
    },[props.profile.profiles]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      setSearch(e.target.value);
    }
    const onGenreChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      props.getPosts(e.target.value);
    }

    const onSearch = (e: React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(postSearch) {
          setPosts(posts.filter((post) => {
              return post.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          }));
      }else if(!postSearch){
          setProfiles(profiles.filter((profile) => {
              return profile.username.toLowerCase().indexOf(search.toLowerCase()) !== -1;
          }));
      }
    }
    if (!props.loading){
      if(postSearch){
        content = (
          <div className={exploreStyles.content}>
            {posts.map((post)=>{
              return <PostCard user={post.user} username={post.username} key={post._id} _id={post._id} genre={post.genre} title={post.title} description={post.description}/>
            })}
          </div>
        )
      }else{
        content = (
          <div className={exploreStyles.content}>
              {profiles.map((profile)=>{
                return <ProfileCard profile={profile} key={profile._id}/>
              })}
          </div>
        )
      }
    
    }else{
       content = <div style={{fontSize:'20px'}}> Loading...</div>
    }
    let genreSelect = (
      <div className={exploreStyles.genreSelect}>
        Filter:
        <select name="genre"  onChange={onGenreChange} >
          <option value="" >Any</option>
          <option value="Trap">Trap</option>
          <option value="R&B">R&B</option>
          <option value="EDM" >EDM</option>
          <option value="Drill" >Drill</option>
          <option value="Synthwave" >Synthwave</option>
          <option value="Classical" >Classical</option>
          <option value="Pop" >Pop</option>
          <option value="Future Bass" >Future Bass</option>
          <option value="Orchestral" >Orchestral</option>
        </select>
      </div>
    )
    return (
        <Layout>
            <div className={exploreStyles.page}>
              <div className={exploreStyles.search}>
                <div className={exploreStyles.serach_cont}>
                  <form onSubmit={onSearch}><input placeholder="Search" value={search} onChange={onChange} /> <button className={exploreStyles.search_button} type="submit">Search</button></form>
                  <div className={exploreStyles.search_type_cont}>
                    <button onClick={() => setPostSearch(true)} className={postSearch ? `${exploreStyles.postsButton} ${exploreStyles.selectedButton}` : exploreStyles.postsButton}>Posts</button>
                    <button onClick={() => setPostSearch(false)} className={!postSearch ? `${exploreStyles.profilesButton} ${exploreStyles.selectedButton}` : exploreStyles.profilesButton}>Profiles</button>
                  </div>
                  {postSearch ? genreSelect : null}
                </div>
              </div>
              <div className={exploreStyles.contentWrapper}>{content}</div>
            </div>
        </Layout>
  )
}


const mapStateToProps = (state: Props) => ({
  auth: state.auth,
  errors: state.errors,
  loading: state.loading,
  posts: state.posts,
  profile:state.profile
});

export default connect(
  mapStateToProps,
  { getPosts, getAllProfiles }
)(Explore);