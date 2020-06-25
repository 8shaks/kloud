import Head from 'next/head';
import registerStyles from"./register.module.scss";
import Layout from '../../components/layout/layout';
import Link from "next/link";
import { connect } from "react-redux";
import { registerUser } from '../../redux/actions/authActions'
import React, { useState, useEffect, FormEvent } from 'react';
import Router from 'next/router'


interface registerError{
  username:string| null, 
  password: string| null, 
  password2: string| null, 
  email: string| null, 
  server?: string| null
}

interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any,
  // profile:{profile: any, profiles:[any], isLoading:boolean },
//  loginUser:  ({username, password}: loginError) => void,
  registerUser:any
}

const Register = (props:Props) => {
    const [formValues, setFormValues] = useState({ email:"", username:"", password:"", password2:"" });
    const [errors, setErrors] = useState<registerError>({ email:null, username: null, password: null, password2:null, server: null});

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormValues({...formValues, [e.target.name]: e.target.value});
    }
    const checkValid = () =>{
        let errorsNew:registerError = {username:null, password: null, email: null, password2: null};
        formValues.password === '' ? errorsNew.password = 'Please enter a password' : errorsNew.password = null;
        formValues.username === '' ? errorsNew.username = 'Please enter a username' : errorsNew.username = null;
        formValues.email === '' ? errorsNew.email = 'Please enter an email' : errorsNew.email = null;
        formValues.password2 === '' ? errorsNew.password2 = 'Please enter your password' : errorsNew.password2 = null;
        formValues.password.length < 6 || formValues.password.length > 30 ? errorsNew.password = 'Please must be between 6 and 30 characters' : errorsNew.password2 = null;
        formValues.password2 !== formValues.password ? errorsNew.password2 = 'Passwords must match' : errorsNew.password2 = null;
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formValues.email)? errorsNew.email = 'Please enter a valid email' : errorsNew.email = null;
        setErrors(errorsNew);
        if (!errors.email  && !errors.password && !errors.password && !errors.username ) return true
        else return false
    }
    const onSubmit = (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(checkValid()){
            props.registerUser({username:formValues.username,password:formValues.password, email: formValues.email, password2: formValues.password2 });
        }
    }
    useEffect(() => {
        if (props.auth.isAuthenticated) Router.push('/');
     }, [props.auth.isAuthenticated])
    useEffect(() => {
      if (props.errors) return setErrors(props.errors)
      return setErrors({ email:null, username: null, password: null, password2:null, server: null});
    }, [props.errors])
  return (
    <Layout>
      <div className={registerStyles.page}>
          <h1 className={registerStyles.heading}>Register</h1>
        <form  className={registerStyles.form} method="POST" onSubmit={onSubmit}>
            <input onChange={onChange} aria-label="Email" value={formValues.email} name="email" placeholder="Email" />
            {<span className={registerStyles.error}>{errors.email}</span>}
            <input onChange={onChange}  aria-label="Username" value={formValues.username} name="username" placeholder="Username"/>
            {<span className={registerStyles.error}> {errors.username}</span>}
            <input onChange={onChange} type="password" aria-label="Password" value={formValues.password} name="password" placeholder="Password" />
            {<span className={registerStyles.error}>{errors.password}</span>}
            <input onChange={onChange}type="password"  aria-label="Reenter Password" value={formValues.password2} name="password2" placeholder="Reenter Password" />
            {<span className={registerStyles.error}>{errors.password2}</span>}
            <div><button className={registerStyles.registerButton} type="submit">Register</button><Link href="/register" ><a className={registerStyles.loginButton}>Login</a></Link></div>
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
  { registerUser }
)(Register);