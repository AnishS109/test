import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000", { transports: ["websocket"] });

const Video = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    try {
      const stream = webcamRef.current.stream;

      if (!stream || !stream.getVideoTracks().length) {
        console.error("No video tracks found in the stream.");
        return;
      }

      // Create MediaRecorder to capture the video
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });

      // Send recorded video chunks to backend
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("📤 Sending video chunk...");
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
      console.error("Error starting recording:", error);
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
      {/* Webcam Live Feed */}
      <Webcam ref={webcamRef} width="640" height="480" mirrored />

      {/* Start/Stop Recording Button */}
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop" : "Start"} Recording
      </button>
    </div>
  );
};

export default Video;
