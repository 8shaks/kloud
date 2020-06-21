import React, { useEffect } from 'react'
import PropTypes from "prop-types";
import layoutStyles from "./layout.module.scss";
import Navbar from  "../navbar/index";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import store from '../..//redux/store';
import { setCurrentUser, logoutUser } from "../../redux/actions/authActions";
import { clearProfile } from "../../redux/actions/profileActions";
import { LOADING_DONE } from "../../redux/actions/types";
import Router from 'next/router';

export interface layoutProps  { 
    children: React.ReactNode
 }

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
    return (
        <div className={layoutStyles.page}>
            <Navbar/>
            <main className={layoutStyles.main}>{props.children}</main>
        </div>
    )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
