import React from 'react';
import profileCompStyles from "./profileComps.module.scss";
import Link from 'next/link';

interface Props {
    userId:string,
    username:string,
    changeFriendReqStatus:(friendReq:{username:string, accept:boolean}) => void
}
export default (props: Props) => {
    const onAcceptRequest = () =>{
        props.changeFriendReqStatus({username:props.username, accept:true});
    }
    const onDenyRequest = () =>{
        props.changeFriendReqStatus({username:props.username, accept:false});
    }
    return (
        <div className={profileCompStyles.friendReqCard}>
            <div className={profileCompStyles.flexCardHeader}>
                <h3>{props.username}</h3>
                <Link href="/"><a className={profileCompStyles.profileLink}>View Profile</a></Link> 
            </div>
            <button onClick={onAcceptRequest} className={profileCompStyles.acceptButton}>Accept Request</button><button onClick={onDenyRequest} className={profileCompStyles.denyButton}>Deny Request</button>
        </div>
    )
}
