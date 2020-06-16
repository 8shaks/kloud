import Head from 'next/head';
import editPostStyles
 from"../posts.module.scss";
import Layout from '../../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { editPost, getPost } from '../../../redux/actions/postActions';
import React, { useState, useEffect, FormEvent } from 'react';
import Router from 'next/router'
import { PostType } from '../../../@types/customType';
import { useRouter } from 'next/router'

interface postError{
  title:string | null, 
  description: string | null,
  server?: string | null
}

interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any,
  posts: {post: PostType, posts:PostType[]}
  editPost:any,
  getPost: any,
  loading: boolean
}

const createPost = (props:Props) => {
  const [postValues, setpostValues] = useState({ title:"", description:"" });
    const [errors, setErrors] = useState<postError>({ title:null, description: null});
    const router = useRouter()
    const { id } = router.query

    const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) =>{
        setpostValues({...postValues, [e.target.name]: e.target.value});
    }
    const checkValid = () =>{
        let errorsNew:postError = {title:null, description: null};
        postValues.description.length > 300 || postValues.description.length < 20  ? errorsNew.description = 'Please enter a description 20 and 300 characters' : errorsNew.description = null;
        postValues.title.length > 200 || postValues.title.length < 10  ? errorsNew.title = 'Please enter a title between 10 and 100 characters' : errorsNew.title = null;

        setErrors(errorsNew);
        if (!errors.title  && !errors.description ) return true
        else return false
    }
    const onSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(checkValid()){
            props.editPost({id:props.posts.post._id, title:postValues.title, description: postValues.description });
        }
    }
    useEffect(() => {
      if(props.auth.isAuthenticated){
        props.getPost(id)
      }
   },[props.auth.isAuthenticated])
    useEffect(() => {
        if(props.posts.post !== null){
          console.log(props)
          setpostValues({title:props.posts.post.title, description:props.posts.post.description})
        }
     },[props.posts.post])
    useEffect(() => {
      if (props.errors) return setErrors(props.errors)
      return setErrors({ title:null, description: null, server: null});
    }, [])
    // if (!props.auth.isAuthenticated) return (<div className={editPostStyles.page}> Not valid user :/</div>)
    let content = (<div className={editPostStyles.page}> Check your url and try again. Make sure you're logged in</div>)
    if(props.auth.isAuthenticated){
      content = (
        <div className={editPostStyles.page}>
          <h1 className={editPostStyles.heading}>Create a post</h1>
          <form  className={editPostStyles.form} method="POST" onSubmit={onSubmit}>
            <label>Title</label>
            <input onChange={onChange} aria-label="Title" value={postValues.title} name="title" placeholder="Looking for Travis Scott type beat"/>
            {<span className="error">{errors.title}</span>}
            <label>Description</label>
            <textarea onChange={onChange} aria-label="Description" value={postValues.description} name="description" placeholder="Looking for a travis scott type producer I can collab with" />
            {<span className="error">{errors.description}</span>}
            <button>Save Profile</button>
          </form>
        </div>
      )
    }
  return (
    <Layout>
      {content}
    </Layout>
  )
}


const mapStateToProps = (state: Props) => ({
  auth: state.auth,
  errors: state.errors,
  posts:state.posts
});

export default connect(
  mapStateToProps,
  { editPost, getPost }
)(createPost);