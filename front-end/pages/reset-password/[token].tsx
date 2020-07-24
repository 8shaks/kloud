import Head from 'next/head';
import resetStyles from"./passwordReset.module.scss";
import Layout from '../../components/layout/layout';
import { connect } from "react-redux";
import React, { useState, useEffect, FormEvent } from 'react';
import Router, {useRouter} from 'next/router';
import axios from 'axios';
import host from '../../vars';
import Link from "next/link";


interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any
}
const PasswordReset = (props:Props) => {
    const router = useRouter();
    const { token } = router.query;
    const [pwResetStatus, setPwResetStatus] = useState(false);
    const [formValues, setFormValues] = useState({password:"", password2:""});
    const [errors, setErrors] = useState<{password:null| string, password2:null| string, server:null | string, token: null | string}>({password:null, password2:null, server:null, token: null});


    useEffect(() => {
        if (props.auth.isAuthenticated) Router.push('/explore');
    }, [props.auth.isAuthenticated]);

    useEffect(() => {
        axios.get(`${host}/api/auth/pw_reset_token/${token}`).catch((err)=>{
            console.log(err)
            Router.push('/explore');
        })
    }, []);

    let pwResetContent;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormValues( {...formValues, [e.target.name]:e.target.value});
    }   
    const onSubmit =  (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let newErrors:{password:null| string, password2:null| string, server:null | string, token: null | string} = {password:null, password2:null, server:null, token:null};
        formValues.password === '' ? newErrors.password = 'Please enter a password' : newErrors.password = null;
        formValues.password2 === '' ? newErrors.password2 = 'Please enter your password' : newErrors.password2 = null;
        formValues.password.length < 6 || formValues.password.length > 30 ? newErrors.password = 'Password must be between 6 and 30 characters' : newErrors.password2 = null;
        formValues.password2 !== formValues.password ? newErrors.password2 = 'Passwords must match' : newErrors.password2 = null;

        if (!newErrors.password && !newErrors.password2 && !newErrors.server){
        axios.post(`${host}/api/auth/reset_password`, {...formValues, token}).then(() => {
            setPwResetStatus(true);
        }).catch((err)=>{
            setErrors(err.response.data.errors);
        })
        }else{
            setErrors(newErrors);
        }
    }
    if(pwResetStatus){
        pwResetContent = (
        <div className={resetStyles.page}>
            <div className={resetStyles.heading}>
                <h3>Your password has been reset</h3><h4>Click the link below to login</h4>
                <Link href="/login"><a className={resetStyles.loginLink}>Login</a></Link>
            </div>
        </div>
        )
    }else{
        pwResetContent = (
        <div className={resetStyles.page}>
            <div className={resetStyles.heading}>
            <h1>Password Reset</h1>
            <h4>Please choose a password between 6 and 30 characters</h4>
            </div>
            <form onSubmit={onSubmit} className={resetStyles.form}>
            <input onChange={onChange} value={formValues.password} name="password" type="password" placeholder="Password"/>
            {<span className={resetStyles.error}>{errors.password}</span>}
            <input onChange={onChange} value={formValues.password2} name="password2" type="password" placeholder="Reenter Password"/>
            {<span className={resetStyles.error}>{errors.password2}</span>}
            <button type="submit">Submit</button>
            {<span className={resetStyles.error}>{errors.token}</span>}
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