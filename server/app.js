const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyDRTXIWOeecfaLpDK78sD8qOG6bNX86r2U";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

app.post('/feedback', async (req, res) => {
  const { interviewData } = req.body;

  const expressionCount = {};
  let totalConfidence = 0;

  interviewData.forEach(entry => {
    expressionCount[entry.expression] = (expressionCount[entry.expression] || 0) + 1;
    totalConfidence += entry.confidence;
  });

  const dominantExpression = Object.keys(expressionCount).reduce((a, b) =>
    expressionCount[a] > expressionCount[b] ? a : b
  );

  const averageConfidence = (totalConfidence / interviewData.length).toFixed(2);

  const prompt = `
    Based on the interview data:
    - Dominant expression: ${dominantExpression}
    - Average confidence: ${averageConfidence}

    Provide realistic, concise feedback in JSON format including:
    1. Strengths
    2. Areas for improvement
    3. Suggestions for future interviews
  `;

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      { prompt: prompt, max_tokens: 500 },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get feedback from Gemini API' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
