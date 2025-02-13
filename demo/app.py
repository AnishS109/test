from flask import Flask
from flask_socketio import SocketIO
import cv2
import numpy as np
import torch
from torchvision import transforms
from PIL import Image
import io

# Load Pretrained Facial Expression Model (Example: torch model)
# Replace this with your actual model
MODEL_PATH = "expression_model.pth"
model = torch.load(MODEL_PATH, map_location=torch.device("cpu"))
model.eval()

# Image Transformations
transform = transforms.Compose([
    transforms.Resize((48, 48)),
    transforms.Grayscale(),
    transforms.ToTensor(),
])

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Emotion Labels
emotion_labels = ["Angry", "Neutral", "Happy"]

@socketio.on("video_chunk")
def receive_video_chunk(data):
    """Receive video chunks and process frames to detect emotions"""
    try:
        # Convert byte array to image
        image_stream = io.BytesIO(data)
        image = Image.open(image_stream)

        # Convert to OpenCV format (BGR)
        frame = np.array(image)
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

        # Convert frame to grayscale for processing
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Process with facial expression model
        emotion = detect_expression(gray_frame)

        # Display the processed frame
        cv2.imshow("Live Video", frame)
        cv2.putText(frame, f"Expression: {emotion}", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow("Processed Video", frame)
        cv2.waitKey(1)

        print(f"✅ Frame received | Detected Emotion: {emotion}")

    except Exception as e:
        print(f"❌ Error processing video chunk: {e}")

def detect_expression(gray_frame):
    """Detects facial expression using a trained model"""
    try:
        # Convert frame to PIL Image
        img = Image.fromarray(gray_frame)
        img_tensor = transform(img).unsqueeze(0)  # Add batch dimension

        # Predict emotion
        with torch.no_grad():
            outputs = model(img_tensor)
            _, predicted = torch.max(outputs, 1)
            return emotion_labels[predicted.item()]
    except Exception as e:
        print(f"❌ Error detecting expression: {e}")
        return "Unknown"

if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
