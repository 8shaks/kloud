import React from 'react';
import collabCompStyles from "./collabComps.module.scss";
import Link from 'next/link';
import moment from 'moment';

interface Props {
    title:string,
    description:string,
    date:number,
    collaborator:{userId: string, username: string}
    changeCollabRecStatus:(collabReq:{username:string, accept:boolean}) => void
}
export default (props: Props) => {
    let dateObj = moment( new Date(props.date)).format('YYYY-MM-DD')
    const onAcceptRequest = () =>{
        props.changeCollabRecStatus({username:props.collaborator.username, accept:true});
    }
    const onDenyRequest = () =>{
        props.changeCollabRecStatus({username:props.collaborator.username, accept:false});
    }
    return (
        <div className={collabCompStyles.collabRecCard}>
            <div className={collabCompStyles.flexCardHeader}>
                <h3>{props.title}</h3>
                <Link href={`/profiles/${props.collaborator.username}`}><a className={collabCompStyles.profileLink}>View {props.collaborator.username}'s profile</a></Link> 
            </div>
            <span>{dateObj}</span>
            <p className={collabCompStyles.description}>{props.description}</p>
            <button onClick={onAcceptRequest} className={collabCompStyles.acceptButton}>Accept Request</button><button onClick={onDenyRequest} className={collabCompStyles.denyButton}>Deny Request</button>
        </div>
    )
}
