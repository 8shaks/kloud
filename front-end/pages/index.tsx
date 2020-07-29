import Head from 'next/head';
import indexStyles from"./styles/index.module.scss";
import Layout from '../components/layout/layout'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { connect } from "react-redux";



interface Props{
  auth: {isAuthenticated: boolean, user:{ id:string, username: string}},
  errors: any
}

const Home = (props:Props) => {

  return (
    <Layout>
      <div className={indexStyles.page}>
        <div className={indexStyles.heading}>
          <h1>Made for producers</h1>
          <span>The ultimate collaboration tool</span>
          {!props.auth.isAuthenticated ? <Link href="/register"><a>Register Today</a></Link> : null}
        </div>
        <div className={indexStyles.announcements}>
          <h1>Announcements</h1>
        </div>
      </div>
    </Layout>
  )
}

const mapStateToProps = (state: Props) => ({
  auth: state.auth,
  errors: state.errors,
});


export default connect(
  mapStateToProps
)(Home);