import React, { Fragment } from 'react';
import messageComp from "./messageComps.module.scss";
import Link from 'next/link';
import { MessageType } from "../../@types/customType";

interface Props {
    message: MessageType,
    user: string
}
export default (props: Props) => {
    let messageContent, fileContent;
    const { message, user } = props
    if (message.files){
        fileContent = (
            <Fragment>
                {message.files.map((file) =>{
                    return <span className={messageComp.messageBubble}><b> FILE: {file.name}</b></span>
                })}
            </Fragment>
        )
    }
    if(message.sender === user){
        if (message.files){
            fileContent = (
                <Fragment>
                    {message.files.map((file) =>{
                        return <span className={messageComp.messageBubble + " " + messageComp.sender}><b> FILE: {file.name}</b></span>
                    })}
                </Fragment>
            )
        }
        messageContent = ( 
        <div className={messageComp.messageWrapper}>
            <span className={messageComp.messageBubble + " " + messageComp.sender}>
                    {message.files.map((file:any) =>{
                        let test:string| File = "error";
                        let fileName = "error";
                        console.log(file)
                        if(file.file.AcceptRanges){
                            console.log("bruv")
                            fileName = file.fileName;
                            let temp = new Uint8Array(file.file.Body.data)
                            test = window.URL.createObjectURL(new Blob([temp], { type: 'application/mp3' }));
                        }else{
                            fileName = file.name;
                            test = window.URL.createObjectURL(new Blob([file.file], {type: "audio/mpeg"}));
                        }
                        return <a href={test} download={file.name}><b> FILE: {fileName}<br/><br/></b></a>
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
