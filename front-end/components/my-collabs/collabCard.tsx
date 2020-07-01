import React from 'react';
import collabComps from "./collabComps.module.scss";
import Link from 'next/link';

interface Props {
    title:string,
    description:string,
    date?:number,
    _id:string,
    user: {user: string, username: string},
    collaborator:{user: string, username: string}
}
export default (props: Props) => {
    return (
        <div className={collabComps.collabCard}>
            <div className={collabComps.flexCardHeader}>
               <h3>{props.title}</h3>
                <Link href={`/profiles/${props.collaborator.username}`}><a className={collabComps.profileLink}>Collab with {props.user.username}</a></Link> 
            </div>
            <span>{props.date}</span>
            <p className={collabComps.description}>{props.description}</p>
        </div>
    )
}
