import React from 'react'

export default () =>{
    const rtcPeerConnection = new RTCPeerConnection();
    const recordingOptions = {
        mimetype: "video/mp4",
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 250000
      };
 
      navigator.mediaDevices
      .enumerateDevices()
      .then((data) => console.log(data))
      .catch(err => console.log(err));
      const startButton = document.querySelector("button#start");
      const endButton = document.querySelector("button#stop");
      const video = document.getElementById("localVideo");
      const recordedVideoWindow = document.querySelector("video#recordedVideo");
      const audioDeviceOption = document.querySelector("select#audioDeviceOption");
      const videoDeviceOption = document.querySelector("select#videoDeviceOption");
  
    return (
        <div>
            
        </div>
    )
}
