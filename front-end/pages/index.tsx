import Head from 'next/head';
import indexStyles from"./styles/index.module.scss";
import Layout from '../components/layout/layout'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Home = () => {

  return (
    <Layout>
      <div className={indexStyles.page}>
        <div className={indexStyles.heading}>
          <h1>Made for producers</h1>
          <span>The ultimate collaboration tool</span>
          <Link href="/register"><a>Register Today</a></Link>
        </div>
      </div>
    </Layout>
  )
}

export default Home