import Head from 'next/head';
import resetStyles from"./passwordReset.module.scss";
import Layout from '../../components/layout/layout';
import { connect } from "react-redux";
import React, { useState, useEffect, FormEvent } from 'react';
import Router from 'next/router';
import axios from 'axios';
import host from '../../vars';


interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any
}
const PasswordReset = (props:Props) => {
  const [pwResetStatus, setPwResetStatus] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{email:null| string}>({email:null});


  useEffect(() => {
    if (props.auth.isAuthenticated) Router.push('/explore');
  }, [props.auth.isAuthenticated])

  let pwResetContent;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setEmail(  e.target.value);
  }   
  const onSubmit =  (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newErrors:string | null = null;
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) ? newErrors = 'Please enter a valid email' : newErrors = null;
    if (newErrors === null){
      axios.post(`${host}/api/auth/sendpw_email`, {email}).then(() => {
        setPwResetStatus(true);
      }).catch((err)=>{
        setErrors({email:"Server Error"});
      })
    }else{
      setErrors({email:newErrors});
    }
  }
  if(pwResetStatus){
    pwResetContent = (
      <div className={resetStyles.page}>
        <div className={resetStyles.heading}>
          If we find an account associated with this email, you will recieve an email from us.
        </div>
      </div>
      )
  }else{
    pwResetContent = (
      <div className={resetStyles.page}>
        <div className={resetStyles.heading}>
          <h1>Reset Password</h1>
          <h4>We'll send an email if we find an account associated with the email you enter.</h4>
        </div>
        <form onSubmit={onSubmit} className={resetStyles.form}>
          <input onChange={onChange} value={email} placeholder="Email"/>
          {<span className={resetStyles.error}>{errors.email}</span>}
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
    
    
  return (
    <Layout>
      {pwResetContent}
    </Layout>
  )
}


const mapStateToProps = (state: Props) => ({
  auth: state.auth,
  errors: state.errors,
});


export default connect(
  mapStateToProps
)(PasswordReset);