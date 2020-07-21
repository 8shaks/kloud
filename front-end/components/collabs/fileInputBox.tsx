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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if(props.collabId){
            axios.get(`${host}/api/collabs/getcollab/${props.collabId}`).then((res) => {
                setCollab(res.data)
            })
        }
    }, [props.collabId])

    const toggleViewFiles = async () => {
        if(!viewFilesStatus){
            axios.get(`${host}/api/collabs/getcollab/${props.collabId}`).then((res) => {
                setCollab(res.data)
                changeViewFiles(!viewFilesStatus);
            })
        }else{
            changeViewFiles(!viewFilesStatus);
        }
    }
    if(!collab) return <div> Loading...</div>

    const onFileChange = (e:  any) => {
        setFiles(e.target.files[0]);
    }
    const onSubmitFile = () => {
        if(files){
            setLoading(true);
            let formData = new FormData();
            formData.append("file", files);
            axios.post(`${host}/api/collabs/upload_file/${props.collabId}`, formData).then(() => {
                setLoading(false);
                toggleViewFiles();
                setCollab({...collab, files:[...collab.files, { fileName : files.name, fileKey: `${props.collabId}/${files.name}`, date:Date.now()}]})
            }).catch(err => {
                setLoading(false);
                setError("Only mp3 and wav files under 10mb!");
                console.log(err)
            })
        }
        
    }

    const getFile = (fileName: string) => {
        axios.post(`${host}/api/collabs/getfile`,{fileName, collab_id: props.collabId }).then((res) =>{
                    window.open(res.data)
        })  
    }
    let viewFiles = (
        <div className={messageComp.viewFiles}>
            <span onClick={toggleViewFiles} className={messageComp.close} >&times;</span>
            <h2 className={messageComp.fileInput_title}>Files</h2>
            <div className={messageComp.fileCont}>
                <div className={messageComp.leftInput}> 
                    <input accept=".mp3, .wav"  type="file" onChange={onFileChange} name="Files" />  
                    <button className={messageComp.uploadFile} onClick={onSubmitFile}>Upload File</button>
                    { loading ? <div style={{marginTop:"10px"}}>Loading...</div> : null}
                    { error.length > 0 ? <div className={messageComp.error}>{error}</div> : null}
                </div>
                <div className={messageComp.rightFiles}>
                    {collab.files.map((file) => {
                        return <div className={messageComp.fileLink}><a download={file.fileName} key={file.fileName} onClick={() => {getFile(file.fileName)}}>{file.fileName}</a></div>
                    })}
                </div>
            </div>
            
        </div>
    )
    return (
        <div className={messageComp.fileInput}> 
            <div className={messageComp.collabHeader}>
                <h2 className={messageComp.collabTitle}>{collab.title}</h2><button className={messageComp.viewFiles_button} onClick={toggleViewFiles}>View files</button>
            </div>
            {viewFilesStatus ? <div className={messageComp.viewFilesModal}>{viewFiles}</div> : null}
        </div>
    )
}

