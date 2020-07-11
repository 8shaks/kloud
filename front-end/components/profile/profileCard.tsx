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
        <Link href={`/profiles/${profile.user}`}>
            <div key={profile._id} className={profileComps.profileCard}>
                <div className={profileComps.flexCardHeader}>
                    <h3>{profile.username}</h3>
                </div>
                <p className={profileComps.bio}>{profile.bio ? `${profile.bio.substring(0,30)}...` : "No bio"}</p>
            </div>
        </Link>
    )
}
