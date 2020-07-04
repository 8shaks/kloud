import Head from 'next/head';
import loginStyles from"./login.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from '../../redux/actions/authActions'
import React, { useState, useEffect, FormEvent } from 'react';
import Router from 'next/router'

interface loginError{
  username:string| null, 
  password: string| null, 
  server?: string| null,
  auth?: string| null,
}

interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any,
  // profile:{profile: any, profiles:[any], isLoading:boolean },
//  loginUser:  ({username, password}: loginError) => void,
loginUser:any
}
const Login = (props:Props) => {
    const [formValues, setFormValues] = useState({ username:"", password:"" });
    const [errors, setErrors] = useState<loginError>({ username: null, password: null, server: null});
      
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormValues({...formValues, [e.target.name]: e.target.value});
    }
    const checkValid = () =>{
        let errorsNew:loginError = { username: null, password: null, server: null};
        formValues.password === '' ? errorsNew.password = 'Please enter a password' : errorsNew.password = null;
        formValues.username === '' ? errorsNew.username = 'Please enter a username' : errorsNew.username = null;
        setErrors(errorsNew);
        if (!errors.username  && !errors.password ) return true
        else return false
    }
    const onSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(checkValid()){
            props.loginUser({username:formValues.username,password:formValues.password});
        }
    }
    useEffect(() => {
        if (props.auth.isAuthenticated) Router.push('/explore');
    }, [props.auth.isAuthenticated])
    useEffect(() => {
        return setErrors(props.errors);
    }, [props.errors])
  return (
    <Layout>
      <div className={loginStyles.page}>
          <h1 className={loginStyles.heading}>Sign In</h1>
        <form className={loginStyles.form}  method="POST" onSubmit={onSubmit}>
            <input onChange={onChange} aria-label="Username" value={formValues.username} name="username" placeholder="Username"/>
            {<span className={loginStyles.error}>{errors.username}</span>}
            <input onChange={onChange} type="password" aria-label="Password" value={formValues.password} name="password" placeholder="Password" />
            {<span className={loginStyles.error}>{errors.password}</span>}
            <div><button className={loginStyles.loginButton} type="submit">Login</button><Link href="/register" ><a className={loginStyles.registerButton}>Register</a></Link></div>
            {<span className={loginStyles.error}>{errors.auth}</span>}
        </form>
      </div>
    </Layout>
  )
}


const mapStateToProps = (state: { auth: {isAuthenticated: boolean, user:{ id:string, username: string}}; errors: any; }) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);