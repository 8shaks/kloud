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
    user: string,
    key: string
}
export default (props: Props) => {
    return (
        <Link href={`/posts/[id]`} as={`/posts/${props._id}`}>
            <div key={props._id} className={postComp.postCard}>
                <div className={postComp.flexCardHeader}>
                       <h3>{props.title}</h3>
                        <span className={postComp.genre}>{props.genre} </span>
                        <Link as={`/profiles/${props.user}`} href={`/profiles/[id]`}><a className={postComp.profileLink}>{props.username}</a></Link> 
                </div>
                <p className={postComp.description}>{props.description.substring(0,30)}...</p>
            </div>
        </Link>
    )
}
