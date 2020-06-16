import React, { Fragment } from 'react';
import { social } from "../../@types/customType";

interface Props {
    social:social,
    onChange:(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
    errors:{youtube?:string | null, instagram?:string | null, soundcloud?:string | null, twitter?:string | null, facebook?:string | null}
}

export default function socialLinksForm(props:Props) {
    const {social, onChange, errors} = props;

    
    return (
        <Fragment>
            <label>Youtube</label>
            <input onChange={onChange} aria-label="Youtube" value={social.youtube} name="youtube" placeholder="Youtube"/>
            {<span className="error">{errors.youtube}</span>}
            <label>Instagram</label>
            <input onChange={onChange} aria-label="Instagram" value={social.instagram} name="instagram" placeholder="Instagram"/>
            {<span className="error">{errors.instagram}</span>}
            <label>SoundCloud</label>
            {<span className="error">{errors.soundcloud}</span>}
            <input onChange={onChange} aria-label="Soundcloud" value={social.soundcloud} name="soundcloud" placeholder="Soundcloud"/>
            <label>Twitter</label>
            {<span className="error">{errors.twitter}</span>}
            <input onChange={onChange} aria-label="Twitter" value={social.twitter} name="twitter" placeholder="Twitter"/>
            <label>Facebook</label>
            {<span className="error">{errors.facebook}</span>}
            <input onChange={onChange} aria-label="Facebook" value={social.facebook} name="facebook" placeholder="Facebook"/>
        </Fragment>
    )
}
