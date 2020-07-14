import React, { Fragment, useEffect, useRef } from 'react';
import messageComp from "./messageComps.module.scss";
import Link from 'next/link';
import { MessageType } from "../../@types/customType";
import axios from "axios";
import host from '../../vars';
import { isElementInViewport } from "../../utils/messages";
import ReactDOM from 'react-dom';

interface Props {
    message: MessageType,
    user: string
}
export default (props: Props) => {
    let messageContent;
    const { message, user } = props
    const userSent = useRef(null);
    const userReceieved = useRef(null);

    // const isInViewport = (offset = 0) => {
    //     // const node =  ReactDOM.findDOMNode(userReceieved.current) as Element
    //     if (!userReceieved || !userReceieved.current) return false;
    //     const top = userReceieved.current.getBoundingClientRect().top;
    //     return (top + offset) >= 0 && (top - offset) <= window.innerHeight;
    //   }

    
    if(message.sender === user){
        messageContent = ( 
        <div ref={userSent}  className={messageComp.messageWrapper}>
            <span key={message.content} className={messageComp.messageBubble + " " + messageComp.sender}>
                {message.content}
            </span>
        </div>
        )
    }else{
        messageContent = ( 
            <div ref={userReceieved} className={messageComp.messageWrapper}>
                <span key={message.content} className={messageComp.messageBubble + " " + messageComp.receiver}>
                    {message.content}
                </span>
            </div>
            )
    }
    return messageContent;
}

