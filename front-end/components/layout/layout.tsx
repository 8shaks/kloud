import React, { useEffect, Fragment } from 'react'
import PropTypes from "prop-types";
import layoutStyles from "./layout.module.scss";
import Navbar from  "../navbar/index";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import store from '../../redux/store';
import { connect } from "react-redux";
import { setCurrentUser, logoutUser } from "../../redux/actions/authActions";
import { clearProfile } from "../../redux/actions/profileActions";
import { LOADING_DONE } from "../../redux/actions/types";
import Router from 'next/router';
import { ProfileType, ConversationType } from "../../@types/customType";
import host from '../../vars';
import axios from 'axios'
import io from "socket.io-client";

interface layoutProps{
  auth: {isAuthenticated: boolean, user:{ user:{id:string, username: string}}},
  errors: any,
  profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean},
  loading:boolean,
  children: React.ReactNode
}
// const socket = io(host);
const Layout =  ( props : layoutProps) => {
    const test = async (decoded:{exp:number}) =>{
      await store.dispatch(setCurrentUser(decoded));
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        store.dispatch(clearProfile());

        Router.push("/login")
      }
      store.dispatch({type:LOADING_DONE})
    }
    useEffect(  () => {
        if (localStorage.token) {
          setAuthToken(localStorage.token);
          const decoded:{exp:number} = jwt_decode(localStorage.token);
          test(decoded);
        }
        store.dispatch({type:LOADING_DONE})
      }, []);

      // useEffect(() => {
      //   if(!props.loading){
      //     if (!props.auth.isAuthenticated ) Router.push('/');
      //     else {
      //       axios.get(`${host}/api/collabs/collabconvos`).then((res)=>{ 
      //         res.data.convos.forEach((convo:ConversationType) => {
      //           socket.emit("join", convo._id);
      //         })
      //       })
      //       // props.getCurrentProfile();
      //     }
      //   }
      //   return () => {
      //     // socket.emit('disconnect')
      //     socket.off('disconnect');
      //   }
      // }, [props.loading])
    return (
        <Fragment>
            <Navbar/>
            <main className={layoutStyles.main}>{props.children}</main>
        </Fragment>
    )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
const mapStateToProps = (state: { loading: boolean, profile:{ profile:ProfileType, profiles:ProfileType[], loading: boolean}, auth: {isAuthenticated: boolean, user:{ user: {id:string, username: string}}}; errors: any; }) => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  {}
)(Layout);