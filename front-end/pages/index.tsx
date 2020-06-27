import Head from 'next/head';
import indexStyles from"./styles/index.module.scss";
import Layout from '../components/layout/layout'
import React, { useState, useEffect } from 'react';

const Home = () => {

  return (
    <Layout>
      <div className={indexStyles.page}>
        <div className={indexStyles.heading}>
          <h1>Made for producers</h1>
          <span>The ultimate collaboration tool</span>
          <button >Get Kloud for free</button>
          
        </div>
      </div>
    </Layout>
  )
}

export default Home