import React from 'react'

export default () =>{
    const rtcPeerConnection = new RTCPeerConnection();
    const recordingOptions = {
        mimetype: "video/mp4",
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 250000
      };
    //   const gotDevices = devices => {
    //     if (devices) {
    //       for (let i = 0; i < devices.length; i++) {
    //         var deviceInfo = devices[i];
    //         const deviceOption = document.createElement("option");
    //         deviceOption.innerHTML = deviceInfo.label;
    //         deviceOption.title = deviceInfo.label;
    //         deviceOption.value = deviceInfo.deviceId;
    //         if (deviceInfo.kind === "audioinput") {
    //           audioDeviceOption.appendChild(deviceOption);
    //         }
    //         if (deviceInfo.kind === "videoinput") {
    //           videoDeviceOption.appendChild(deviceOption);
    //         }
      
    //         console.log("deviceinfo", deviceInfo);
    //       }
    //     }
    //   };
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
        
    // const handleSuccess = (stream:any) => {
    //     window.MSStream = stream;
    //     video.srcObject = stream;
    //     toggleCamera.style.display = "none";
    // };
  
    return (
        <div>
            
        </div>
    )
}
