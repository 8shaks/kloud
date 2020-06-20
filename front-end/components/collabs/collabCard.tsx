import React from 'react';
import collabComps from "./collabComps.module.scss";
import Link from 'next/link';

interface Props {
    title:string,
    description:string,
    date?:Date,
    _id:string,
    user: {userId: string, username: string},
    collaborator:{userId: string, username: string}
}
export default (props: Props) => {
    return (
        <div className={collabComps.collabCard}>
            <div className={collabComps.flexCardHeader}>
                <Link href={`/collabs/${props._id}`}><h3>{props.title}</h3></Link>
                <Link href={`/profiles/${props.collaborator.username}`}><a className={collabComps.profileLink}>Collab with {props.collaborator.userId}</a></Link> 
            </div>
            <span>{props.date}</span>
            <p className={collabComps.description}>{props.description}</p>
        </div>
    )
}
