import React, { useEffect, useState} from 'react';
import messageComp from "./messageComps.module.scss";
import Link from 'next/link';
import { MessageType, CollabType } from "../../@types/customType";
import axios from "axios";
import host from '../../vars';
import { stringify } from 'querystring';

interface Props {
    collabId?:string
}
export default (props: Props) => {
    const [viewFilesStatus, changeViewFiles] = useState(false);
    const [collab, setCollab] = useState<CollabType | null>(null);
    const [files, setFiles] = useState<File>();
    useEffect(() => {
        if(props.collabId){
            axios.get(`${host}/api/collabs/getcollab/${props.collabId}`).then((res) => {
                setCollab(res.data)
            })
        }
    }, [])
    const toggleViewFiles = () => {
        changeViewFiles(!viewFilesStatus);
    }
    if(!collab) return <div> Loading...</div>

    const onFileChange = (e:  any) => {
        setFiles(e.target.files[0]);
    }
    const onSubmitFile = () => {
        if(files){
            let formData = new FormData();
            formData.append("file", files);
            axios.post(`${host}/api/collabs/upload_file/${props.collabId}`, formData).then(() => {
                
                setCollab({...collab, files:[...collab.files, { fileName : files.name, fileKey: `${props.collabId}/${files.name}`, date:Date.now()}]})
            }).catch(err => {
                console.log(err)
            })
        }
        
    }

    const getFile = (fileName: string) => {
        axios.post(`${host}/api/collabs/getfile`,{fileName, collab_id: props.collabId }).then((res) =>{
                    // console.log(res.data);
                    window.open(res.data)
        })  
    }
    
    // let messageContent, fileContent;
    // const { message, user } = props
    
    // const onClickLink = (e:any ,fileLoc:string) => {
    //     e.preventDefault();
    //     console.log("bruv")
    //     console.log(message)
    //     axios.post(`${host}/api/conversations/file`,{fileLoc, conversationId:message.conversationId}).then((res) =>{
    //         console.log(res.data);
    //         window.open(res.data, "_blank")
    //     })  
    // }
    // if(message.sender === user){
     
    //     messageContent = ( 
    //     <div className={messageComp.messageWrapper}>
    //         <span className={messageComp.messageBubble + " " + messageComp.sender}>
                
    //                 {/* {message.files.map((file:any) =>{
    //                     const fileLink = <a href={""} onClick={(e) => {onClickLink(e,file.file)}} download={file.name}><b> FILE: {file.fileName}<br/><br/></b></a>
    //                     return fileLink
    //                 })} */}
    //             {message.content}
    //         </span>
    //     </div>
    //     )
    // }else{

    //     messageContent = ( 
    //         <div className={messageComp.messageWrapper}>
    //             <span className={messageComp.messageBubble + " " + messageComp.receiver}>
    //                 {/* {message.files.map((file) =>{
    //                     let test = window.URL.createObjectURL(new Blob([file], {type: "audio/mpeg"}))
    //                     return <a href={test} download><b> FILE: {file.name}<br/><br/></b></a>
    //                 })} */}
    //                 {message.content}
    //             </span>
    //         </div>
    //         )
    // }
    // console.log(collab)
    let viewFiles = (
        <div className={messageComp.viewFiles}>
            <span onClick={toggleViewFiles} className={messageComp.close} >&times;</span>
            <h2> {collab.title} files</h2>
            <div>
                {collab.files.map((file) => {
                    return <div><a download={file.fileName} onClick={() => {getFile(file.fileName)}}>{file.fileName}</a></div>
                })}
            </div>
            <div> 
                <input  type="file" onChange={onFileChange} name="Files" />  
              <button className={messageComp.uploadFile} onClick={onSubmitFile}>Upload File</button>
            </div>
        </div>
    )
    return (
        <div className={messageComp.fileInput}> 
            <button onClick={toggleViewFiles}>View files</button>
            {viewFilesStatus ? <div className={messageComp.viewFilesModal}>{viewFiles}</div> : null}
        </div>
    )
}

