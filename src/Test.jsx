import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Hands } from "@mediapipe/hands";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as cam from "@mediapipe/camera_utils";

const Test = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize MediaPipe Hands
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    // Initialize MediaPipe FaceMesh
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    // Access webcam
    if (webcamRef.current) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  // Drawing landmarks
  const onResults = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      results.image,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Draw hand landmarks
    if (results.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((landmarks) => {
        drawLandmarks(ctx, landmarks, "red");
      });
    }

    // Draw face mesh
    if (results.multiFaceLandmarks) {
      results.multiFaceLandmarks.forEach((landmarks) => {
        drawLandmarks(ctx, landmarks, "blue");
      });
    }
  };

  // Draw keypoints on canvas
  const drawLandmarks = (ctx, landmarks, color) => {
    ctx.fillStyle = color;
    landmarks.forEach((landmark) => {
      ctx.beginPath();
      ctx.arc(landmark.x * 640, landmark.y * 480, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          width: 640,
          height: 480,
          transform: "scaleX(-1)", // Mirror the webcam for natural interaction
        }}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default Test;
