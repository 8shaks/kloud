import Head from 'next/head';
import postStyles from"./createPost.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { addPost } from '../../redux/actions/postActions';
import React, { useState, useEffect, FormEvent } from 'react';
import Router from 'next/router'
import { PostType } from '../../@types/customType';


interface postError{
  title:string | null, 
  description: string | null,
  server?: string | null
}

interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any,
  posts: {post: PostType, posts:PostType[]}
  addPost:any,
  loading: boolean
}

const createPost = (props:Props) => {
  const [postValues, setpostValues] = useState({ title:"", description:"" });
    const [errors, setErrors] = useState<postError>({ title:null, description: null});

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
            props.addPost({title:postValues.title, description: postValues.description });
        }
    }
    useEffect(() => {
        // if (!props.auth.isAuthenticated && !props.loading) Router.push('/');
     }, [props.auth.isAuthenticated, props.loading])
    useEffect(() => {
      if (props.errors) return setErrors(props.errors)
      return setErrors({ title:null, description: null, server: null});
    }, [])
  return (
    <Layout>
      <div className={postStyles.page}>
          <h1 className={postStyles.heading}>Create a post</h1>
        <form  className={postStyles.form} method="POST" onSubmit={onSubmit}>
            <label>Title</label>
            <input onChange={onChange} aria-label="Title" value={postValues.title} name="title" placeholder="Looking for Travis Scott type beat"/>
            {<span className="error">{errors.title}</span>}
            <label>Description</label>
            <textarea onChange={onChange} aria-label="Description" value={postValues.description} name="description" placeholder="looking for a producer who can do this this and this" />
            {<span className="error">{errors.description}</span>}
            <button>Create Post</button>
        </form>
      </div>
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
  { addPost }
)(createPost);