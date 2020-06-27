import React, { Fragment } from 'react';
import messageComp from "./messageComps.module.scss";
import Link from 'next/link';
import { MessageType } from "../../@types/customType";
import axios from "axios";
import host from '../../vars';

interface Props {
    message: MessageType,
    user: string
}
export default (props: Props) => {
    let messageContent, fileContent;
    const { message, user } = props
    
    const onClickLink = (e:any ,fileLoc:string) => {
        e.preventDefault();
        console.log("bruv")
        console.log(message)
        axios.post(`${host}/api/conversations/file`,{fileLoc, conversationId:message.conversationId}).then((res) =>{
            console.log(res.data);
            window.open(res.data, "_blank")
        })  
    }
    if(message.sender === user){
     
        messageContent = ( 
        <div className={messageComp.messageWrapper}>
            <span className={messageComp.messageBubble + " " + messageComp.sender}>
                
                    {message.files.map((file:any) =>{
                        const fileLink = <a href={""} onClick={(e) => {onClickLink(e,file.file)}} download={file.name}><b> FILE: {file.fileName}<br/><br/></b></a>
                        return fileLink
                    })}
                {message.content}
            </span>
        </div>
        )
    }else{
        if (message.files){
            fileContent = (
                <Fragment>
                    {message.files.map((file) =>{
                        return <span className={messageComp.messageBubble + " " + messageComp.receiver}><b> FILE: {file.name}</b></span>
                    })}
                </Fragment>
            )
        }
        messageContent = ( 
            <div className={messageComp.messageWrapper}>
                <span className={messageComp.messageBubble + " " + messageComp.receiver}>
                    {message.files.map((file) =>{
                        let test = window.URL.createObjectURL(new Blob([file], {type: "audio/mpeg"}))
                        return <a href={test} download><b> FILE: {file.name}<br/><br/></b></a>
                    })}
                    {message.content}
                </span>
            </div>
            )
    }
    return messageContent;
}

