
import videoFile from "./assets/video.mp4"; // Import a test video

import React, { useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000", { transports: ["websocket"] });

const Video = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    try {
      // Request access to the webcam (video only, no audio)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  
      if (!stream || !stream.getVideoTracks().length) {
        console.error("No video tracks found in the stream.");
        return;
      }
  
      // Set the video stream to the video element
      videoRef.current.srcObject = stream;
  
      // Create a MediaRecorder instance
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });
  
      // Handle data when available
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(event.data);
          reader.onloadend = () => {
            socket.emit("video_chunk", reader.result);
          };
        }
      };
  
      mediaRecorderRef.current.start(500); // Capture video chunks every 500ms
      setRecording(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert("Please allow camera access or check if your webcam is connected.");
    }
  };
  

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <div>
      <video ref={videoRef} width="640" height="480" controls>
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop" : "Start"} Recording
      </button>
    </div>
  );
};

export default Video;

