import React from 'react';
import messageComp from "./messageComps.module.scss";
import Link from 'next/link';
import { MessageType } from "../../@types/customType";

interface Props {
    message: MessageType,
    user: string
}
export default (props: Props) => {
    let messageContent;
    const { message, user } = props
    if(message.sender === user){
        messageContent = ( 
        <div className={messageComp.messageWrapper}>
            <span className={messageComp.messageBubble + " " + messageComp.sender}>
                {message.content}
            </span>
        </div>
        )
    }else{
        messageContent = ( 
            <div className={messageComp.messageWrapper}>
                <span className={messageComp.messageBubble + " " + messageComp.receiver}>
                    {message.content}
                </span>
            </div>
            )
    }
    return messageContent;
}
