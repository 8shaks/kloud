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
  genre: string | null,
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
    const [postValues, setpostValues] = useState({ title:"", description:"", genre:"" });
    const [errors, setErrors] = useState<postError>({ title:null, description: null, genre:null});

    const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) =>{
        setpostValues({...postValues, [e.target.name]: e.target.value});
    }
    const checkValid = () =>{
        let errorsNew:postError = {title:null, description: null, genre:null};
        postValues.description.length > 300 || postValues.description.length < 20  ? errorsNew.description = 'Please enter a description 20 and 300 characters' : errorsNew.description = null;
        postValues.title.length > 200 || postValues.title.length < 10  ? errorsNew.title = 'Please enter a title between 10 and 100 characters' : errorsNew.title = null;
        postValues.genre.length === 0 ?  errorsNew.genre = 'Please choose a genre' : errorsNew.genre = null;

        setErrors(errorsNew);
        if (!errorsNew.title  && !errorsNew.description && !errorsNew.genre) return true;
        else return false;
    }
    const onSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(checkValid()){
          props.addPost({title:postValues.title, description: postValues.description, genre:  postValues.genre });
        }
    }
    useEffect(() => {
      if (!props.auth.isAuthenticated && !props.loading) Router.push('/');  
     }, [props.auth.isAuthenticated, props.loading])
    useEffect(() => {
      if (props.errors) return setErrors(props.errors)
      return setErrors({ title:null, description: null, server: null, genre:null});
    }, [])

    return (
      <Layout>
        <div className={postStyles.page}>
            <h1 className={postStyles.heading}>Create a post</h1>
          <form  className={postStyles.form} method="POST" onSubmit={onSubmit}>
              <label>Title</label>
              <input onChange={onChange} aria-label="Title" value={postValues.title} name="title" placeholder="Looking for Travis Scott type beat"/>
              {<span className={postStyles.error}>{errors.title}</span>}
              <label>Genre</label>
              <select name="genre" value={postValues.genre} onChange={onChange} className={postStyles.genreSelect}>
                <option value="" selected disabled hidden>Choose genre</option>
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
              {<span className={postStyles.error}>{errors.genre}</span>}
              <label>Description</label>
              <textarea onChange={onChange} aria-label="Description" value={postValues.description} name="description" placeholder="Looking for a producer who can do this this and this" />
              {<span className={postStyles.error}>{errors.description}</span>}
              <button>Create Post</button>
          </form>
        </div>
      </Layout>
    )
}


const mapStateToProps = (state: Props) => ({
  auth: state.auth,
  errors: state.errors,
  posts:state.posts,
  loading:state.loading
});

export default connect(
  mapStateToProps,
  { addPost }
)(createPost);