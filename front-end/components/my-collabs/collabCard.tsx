import React from 'react';
import collabComps from "./collabComps.module.scss";
import Link from 'next/link';
import moment from "moment";

interface Props {
    title:string,
    description:string,
    date:number,
    _id:string,
    user: {user: string, username: string},
    notification?: boolean,
    collaborator:{user: string, username: string}
}
export default (props: Props) => {
    let dateObj = moment( new Date(props.date)).format('YYYY-MM-DD')
    return (
        <div className={collabComps.collabCard}>
            <div className={collabComps.flexCardHeader}>
                <h3><Link as={`/collabs/${props._id}`} href={`/collabs/[id]`}><a>{props.title}{props.notification ? <svg className={collabComps.readLogo} height="15" width="15"><circle cx="8" cy="8" r="6" stroke="black" stroke-width="1" fill="red" /></svg> : null}</a></Link></h3>
                <Link as={`/profiles/${props.collaborator.user}`} href={`/profiles/[id]`} ><a className={collabComps.profileLink}>Collab with {props.user.username}</a></Link> 
            </div>
            <span>{dateObj}</span>
            <p className={collabComps.description}>{props.description}</p>
        </div>
    )
}
