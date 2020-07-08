import React from 'react';
import postComp from "./postComps.module.scss";
import Link from 'next/link';

interface Props {
    title:string,
    description:string,
    date?:Date,
    _id:string,
    username:string,
    genre:string,
    user: string
}
export default (props: Props) => {
    return (
        <div className={postComp.postCard}>
            <div className={postComp.flexCardHeader}>
                    <Link href={`/posts/${props._id}`}><h3>{props.title}</h3></Link>
                    <span className={postComp.genre}>{props.genre} </span>
                    <Link href={`/profiles/${props.user}`}><a className={postComp.profileLink}>{props.username}</a></Link> 
            </div>
            <p>{props.description.substring(0,30)}...</p>
        </div>
    )
}
