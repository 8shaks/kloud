import React from 'react';
import collabCompStyles from "./collabComps.module.scss";
import Link from 'next/link';

interface Props {
    title:string,
    description:string,
    date?:number,
    collaborator:{userId: string, username: string}
    cancelCollabReq:(username:string, title:string, description:string) => void
}
export default (props: Props) => {
    const onCancel = () =>{
        props.cancelCollabReq(props.collaborator.username,"asd", "asd");
    }
    return (
        <div className={collabCompStyles.collabRecCard}>
            <div className={collabCompStyles.flexCardHeader}>
                <h3>{props.title}</h3>
                <Link href={`/profiles/${props.collaborator.username}`}><a className={collabCompStyles.profileLink}>Collab with {props.collaborator.userId}</a></Link> 
            </div>
            <span>{props.date}</span>
            <p className={collabCompStyles.description}>{props.description}</p>
           <button onClick={onCancel} className={collabCompStyles.denyButton}>Cancel Request</button>
        </div>
    )
}
