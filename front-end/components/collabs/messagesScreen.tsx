import React from 'react';
import messageComp from "./messageComps.module.scss";
import Link from 'next/link';
import MessageBubble from "./messageBubble";
import { MessageType } from "../../@types/customType";
import messages from '../../pages/collabs';

interface Props {
    // title:string,
    // description:string,
    // date?:Date,
    // _id:string,
    // username:string,
    // user: string
    messages:MessageType[],
    user:string
}
export default (props: Props) => {
    let messagesContent = (
        <div className={messageComp.messagesScreen}>
            {props.messages.map((message) => {
                return <MessageBubble message={message} user={props.user}/>
            })}
        </div>
    )
    
    return messagesContent;
}
