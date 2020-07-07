import React, { useEffect } from 'react';
import messageComp from "./messageComps.module.scss";
import Link from 'next/link';
import MessageBubble from "./messageBubble";
import { MessageType } from "../../@types/customType";
import messages from '../../pages/collabs';

interface Props {
    messages:MessageType[],
    user:string
}
export default (props: Props) => {
    useEffect(() => {
        let element = document.getElementById("messagesScreen")!;
        element.scrollTop = element.scrollHeight;
    }, [props.messages])
    let messagesContent = (
        <div id="messagesScreen" className={messageComp.messagesScreen}>
            {props.messages.map((message) => {
                return <MessageBubble message={message} user={props.user}/>
            })}
        </div>
    )
    
    return messagesContent;
}
