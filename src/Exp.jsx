import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const Exp = () => {
  const webcamRef = useRef(null);
  const [interviewData, setInterviewData] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      console.log('Models Loaded!');
    };
    loadModels();
  }, []);

  const captureExpression = async () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.expressions) {
        const expressions = detections.expressions;
        const dominantExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        const confidence = expressions[dominantExpression].toFixed(2);

        setInterviewData(prevData => [
          ...prevData,
          { expression: dominantExpression, confidence: parseFloat(confidence) }
        ]);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(captureExpression, 5000);
    return () => clearInterval(interval);
  }, []);

  const endInterview = async () => {
    try {
      const response = await fetch('http://localhost:5000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewData })
      });
      const result = await response.json();
      setFeedback(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>AI Interview Simulator</h1>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={400} />
      <button onClick={endInterview}>End Interview</button>

      {feedback && (
        <div className="feedback-section">
          <h2>Feedback Summary</h2>
          <p><strong>Strengths:</strong> {feedback.strengths}</p>
          <p><strong>Areas for Improvement:</strong> {feedback.areas_for_improvement}</p>
          <p><strong>Suggestions:</strong> {feedback.suggestions}</p>
        </div>
      )}
    </div>
  );
};

export default Exp;
