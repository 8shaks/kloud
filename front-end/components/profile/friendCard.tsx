import React from 'react';
import profileCompStyles from "./profileComps.module.scss";
import Link from 'next/link';

interface Props {
    userId:string,
    username:string,
    date?:Date,
    unfriendUser:any
}
export default (props: Props) => {
    const onUnfriend = () =>{
        props.unfriendUser(props.username);
    }
    return (
        <div className={profileCompStyles.friendReqCard}>
            <div className={profileCompStyles.flexCardHeader}>
                <h3>{props.username}</h3>
                <Link href={`/profiles/${props.userId}`}><a className={profileCompStyles.profileLink}>View Profile</a></Link> 
            </div>
            <button className={profileCompStyles.acceptButton}>Start a Collab</button><button onClick={onUnfriend} className={profileCompStyles.denyButton}>Remove Friend</button>
        </div>
    )
}
