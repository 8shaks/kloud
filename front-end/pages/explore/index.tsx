import Head from 'next/head';
import exploreStyles from"./explore.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getPosts } from '../../redux/actions/postActions'
import React, { useState, useEffect } from 'react';
import PostCard from "../../components/posts/postCard";
import { useRouter } from 'next/router';
import { PostType } from "../../@types/customType";

interface Props {
    auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
    errors: any,
    loading:boolean,
    posts:{post : PostType, posts: PostType[]},
    // profile:{profile: any, profiles:[any], isLoading:boolean },
  //  loginUser:  ({username, password}: loginError) => void,
    getPosts:() => void
}
const Explore = (props:Props) => {
    const router = useRouter()
    let content;
    const [posts, setPosts] = useState<PostType[]>([]);
    useEffect(() => {
      props.getPosts()
    },[]);
    useEffect(() => {
      setPosts(props.posts.posts)
    },[props.posts.posts]);
    // console.log(props.posts)
    if (!props.loading){
      content = (
        <div className={exploreStyles.contentWrapper}>
          {posts.map((post)=>{
            return <PostCard user={post.user} username={post.username} _id={post._id} genre={post.genre} title={post.title} description={post.description}/>
          })}
        </div>
      )
    }
    return (
        <Layout>
            <div className={exploreStyles.page}>
              {content}
            </div>
        </Layout>
  )
}


const mapStateToProps = (state: Props) => ({
  auth: state.auth,
  errors: state.errors,
  loading: state.loading,
  posts: state.posts
});

export default connect(
  mapStateToProps,
  { getPosts }
)(Explore);