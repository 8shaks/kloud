import Head from 'next/head';
import aboutStyles from"./about.module.scss";
import Layout from '../../components/layout/layout';

import React, { useState, useEffect, FormEvent, Fragment } from 'react';
import Router, { useRouter } from 'next/router';

export default function index() {
    return (
        <Layout>
            <Head>
                <title>About Us | Kloud</title>
                <meta name="description" content="The about us page"/>
            </Head>
            <div className={aboutStyles.page}>
                <div className={aboutStyles.content}>
                    <h1 className={aboutStyles.heading}>We are Kloud.</h1>

                    <p>Our goal is to take all the scattered elements of collaboration in the music space, and combine them into one singular easy to use platform.</p>

                    <p>A thing that we’ve noticed, especially as we deal with COVID-19, is that there is no real easy way to find and easily manage collaborations. This goes towards newer producers heavily, who are doomed to just send half-baked loops to people on instagram until they get DM Blocked. And then, surprise, none of the people ever end up responding back due to various issues with the current system.  For newer producers, it is not an efficient way to work with other collaborators, and the fact that there is no dedicated platform  for creating musical content and working together is a big part of it.</p>

                    <p>The second big issue we are hoping to tackle is the fact that, due to the virus, people simply can’t meet with each other in studios to make music together. Whether it be producer/producer, producer/artist, or producer/artist/engineer, it is very hard to be able to get together and make music with the panic of the virus going around. </p>

                    <p>We have a solution to both of these problems. A dedicated producer network, sort of like a social media platform for people that make music, allowing them to easily collaborate with each other. In one application, you will be able to look for collaborations in a nice list, manage all the collaborations you have going on at the moment, be able to participate in live sessions with options of screensharing and a simplified file transfer.</p>

                    <p>Our hope in making this platform is that the workflow of producers will be improved heavily, and that with all the added hassle of the collaboration process, especially in these times, once that hassle is gone producers can finally concentrate on what matters. Making music.</p>
                </div>
            </div>
        </Layout>
    )
}
