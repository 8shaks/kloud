import React from 'react';
import profileComps from "./profileComps.module.scss";
import Link from 'next/link';
import { ProfileType } from '../../@types/customType';

interface Props {
    profile:ProfileType,
    key: string,
}
export default (props: Props) => {
    const { profile } = props;
    return (
        <Link as={`/profiles/${profile.user}`}  href={`/profiles/[id]`}>
            <div key={profile._id} className={profileComps.profileCard}>
                <div className={profileComps.flexCardHeader}>
                    <Link as={`/profiles/${profile.user}`}  href={`/profiles/[id]`}><a><h3>{profile.username}</h3></a></Link>
                </div>
                <p className={profileComps.bio}>{profile.bio ? `${profile.bio.substring(0,30)}...` : "No bio"}</p>
            </div>
        </Link>
    )
}
