import React, { Fragment } from 'react';
import { social } from "../../@types/customType";
import profileCompStyles from "./profileComps.module.scss";

interface Props {
    social:social,
    onChange:(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
    errors:{youtube?:string | null, instagram?:string | null, soundcloud?:string | null, twitter?:string | null, beatstars?:string | null}
}

export default function socialLinksForm(props:Props) {
    const {social, onChange, errors} = props;

    
    return (
        <Fragment>
            <label>Youtube</label>
            <div className={profileCompStyles.input_group}><span></span><input onChange={onChange} aria-label="Youtube" value={social.youtube} name="youtube" placeholder="Youtube"/></div>
            {<span className="error">{errors.youtube}</span>}
            <label>Instagram</label>
            <div className={profileCompStyles.input_group}><span>https://www.instagram.com/</span><input onChange={onChange} aria-label="Instagram" value={social.instagram} name="instagram" placeholder="Instagram"/></div>
            {<span className="error">{errors.instagram}</span>}
            <label>SoundCloud</label>
            {<span className="error">{errors.soundcloud}</span>}
            <div className={profileCompStyles.input_group}><span>https://soundcloud.com/</span><input onChange={onChange} aria-label="Soundcloud" value={social.soundcloud} name="soundcloud" placeholder="Soundcloud"/></div>
            <label>Twitter</label>
            {<span className="error">{errors.twitter}</span>}
            <div className={profileCompStyles.input_group}><span>https://twitter.com/</span><input onChange={onChange} aria-label="Twitter" value={social.twitter} name="twitter" placeholder="Twitter"/></div>
            <label>Beatstars</label>
            {<span className="error">{errors.beatstars}</span>}
            <div className={profileCompStyles.input_group}><span>https://www.beatstars.com/</span><input onChange={onChange} aria-label="Beatstars" value={social.beatstars} name="beatstars" placeholder="Beatstars"/></div>
        </Fragment>
    )
}
