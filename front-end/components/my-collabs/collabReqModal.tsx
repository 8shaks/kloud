import React, {  FormEvent } from 'react'
import collabCompStyles from "./collabComps.module.scss";


interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
  onSubmit : (e: FormEvent<HTMLFormElement>)  => void,
  toggleModal : () => void,
  username:string,
  collabReqInfo : {title:string, description:string},
  errors:{title?:string | null, description?:string | null, server?:string | null}
}

export default function collabReqModal(props:Props) {

    const {collabReqInfo, onChange, errors, onSubmit} = props;
    
    return (
      <div className={collabCompStyles.collabReqModal}>
        <div className={collabCompStyles.collabReqModal_content}>
        <span onClick={props.toggleModal} className={collabCompStyles.close} >&times;</span>
            <h3>Collab request to {props.username}</h3>
          <form onSubmit={onSubmit} className={collabCompStyles.collabReqForm}>
            <input onChange={onChange} aria-label="title" value={collabReqInfo.title} name="title" placeholder="Title"/>
            {<span className={collabCompStyles.error}>{errors.title}</span>}
            <textarea onChange={onChange} aria-label="description" value={collabReqInfo.description} name="description" placeholder="How can you fullfill the collab request?"/>
            {<span className={collabCompStyles.error}>{errors.description}</span>}
            <button  className={collabCompStyles.default_button}>Send request</button>
            {<span className={collabCompStyles.error}>{errors.server}</span>}
          </form>
        </div>
      </div>
    )
}
