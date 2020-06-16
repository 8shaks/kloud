import Head from 'next/head';
import postStyles from"../posts.module.scss";
import Layout from '../../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { getPost, deletePost } from '../../../redux/actions/postActions';
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router'
import { PostType } from "../../../@types/customType"

interface Props{
  auth: {isAuthenticated: boolean, user:{ user:{id:string, username: string}}},
  errors: any,
  posts:{posts:PostType[], post:PostType},
  loading:boolean,
  getPost:any,
  deletePost: any
}

const Post = (props:Props) => {
  const router = useRouter()
  const { id } = router.query
  const [myPost, setPostStatus] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  useEffect(() => {
    if(!props.loading){
     if(typeof id === "string"){
        props.getPost(id);
      }
    }
  }, [props.loading])
  useEffect(() => {
    if(props.auth.isAuthenticated){
      if(props.posts.post.user ===  props.auth.user.user.id){
        setPostStatus(true);
      }
    }
  }, [props.posts.post])

  const deletePost = () => {
    if(props.auth.user.user.id === props.posts.post.user){
      props.deletePost(id);
    }else{
      setAuthError(true);
    }
  }
  let postContent = <div className={postStyles.page}>Loading...</div>
  let editPost;
  if (props.auth.isAuthenticated){
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
          <h1 className={postStyles.heading}>{post.title}</h1>
          <div className={postStyles.content}>
            <p>{post.description}</p>
            {editPost}
            {authError ? <span className={postStyles.error}>You do not own this post!</span> : null}
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
  loading: state.loading
});

export default connect(
  mapStateToProps,
  { getPost, deletePost}
)(Post);