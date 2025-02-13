// const express = require('express');
// const multer = require('multer');
// const pdfParse = require('pdf-parse');
// const axios = require('axios');
// const cors = require('cors');
// const natural = require('natural'); // Added Natural library

// const app = express();
// const upload = multer({ storage: multer.memoryStorage() });

// app.use(cors());

// const API_KEY = 'AIzaSyDRTXIWOeecfaLpDK78sD8qOG6bNX86r2U';

// const expectedSkillsByDomain = {
//   'Frontend Development': ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js', 'TypeScript', 'SASS', 'Bootstrap', 'Tailwind CSS', 'jQuery'],
//   'Backend Development': ['Node.js', 'Express.js', 'Django', 'Flask', 'Ruby on Rails', 'PHP', 'Laravel', 'Spring Boot', 'ASP.NET'],
//   'Database Management': ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Firebase', 'Redis'],
//   'DevOps & Cloud': ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'AWS', 'Azure', 'Google Cloud Platform'],
//   'Data Science & AI': ['Python', 'R', 'SQL', 'SAS', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Keras', 'XGBoost'],
//   'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Java', 'Objective-C'],
//   'UI/UX Design': ['Figma', 'Sketch', 'Adobe XD', 'Wireframing', 'Mockups', 'Interactive Prototypes'],
//   'Cybersecurity & Networking': ['IT Security', 'Authentication', 'Authorization', 'Encryption', 'Networking Protocols'],
//   'AI & Machine Learning': ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Neural Networks', 'Natural Language Processing', 'Computer Vision']
// };

// const tokenizer = new natural.WordTokenizer();

// const extractKeyPhrases = text => tokenizer.tokenize(text).filter(word => word.length >= 4);
// const escapeRegex = str => str.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');

// function calculateATSScore(resumeText, expectedSkills) {
//   const normalizedText = resumeText.toLowerCase();
//   const phrases = extractKeyPhrases(normalizedText);

//   const matchingSkills = expectedSkills.filter(skill => new RegExp(`\\b${escapeRegex(skill.toLowerCase())}\\b`, 'gi').test(normalizedText));
//   const coreSkills = expectedSkills.slice(0, 5);
//   const missingCoreSkills = coreSkills.filter(skill => !matchingSkills.includes(skill));

//   const skillFrequencyScore = matchingSkills.reduce((acc, skill) => acc + (normalizedText.match(new RegExp(escapeRegex(skill.toLowerCase()), 'gi')) || []).length, 0);
//   const similarityScore = (matchingSkills.length / expectedSkills.length) * 100;
//   const keyPhraseScore = (phrases.length / expectedSkills.length) * 50;
//   const frequencyScore = Math.min((skillFrequencyScore / expectedSkills.length) * 50, 50);
//   const penalty = missingCoreSkills.length * 5;

//   const finalScore = Math.max(0, Math.min((0.5 * similarityScore) + (0.3 * keyPhraseScore) + (0.2 * frequencyScore) - penalty, 100));
//   return { score: finalScore, matchingSkills, phrases, missingCoreSkills };
// }

// async function generateSuggestions(resumeSkills, expectedSkills, resumeText, missingCoreSkills) {
//   const prompt = `The resume has the following skills: ${resumeSkills.join(', ')}.\n` +
//     `Expected skills: ${expectedSkills.join(', ')}.\n` +
//     `Missing core skills: ${missingCoreSkills.join(', ')}.\n` +
//     `Resume text: ${resumeText}.\n` +
//     `Provide suggestions to improve the ATS score.`;

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
//       {
//         contents: [{ parts: [{ text: prompt }] }]
//       },
//       {
//         headers: {
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     return response.data.candidates[0]?.content.parts[0]?.text.split('\n') || [];
//   } catch (error) {
//     console.error('Error generating suggestions:', error);
//     return [];
//   }
// }

// app.post('/upload', upload.single('resume'), async (req, res) => {
//   try {
//     const resumeText = (await pdfParse(req.file.buffer)).text;

//     const bestResult = Object.entries(expectedSkillsByDomain)
//       .map(([domain, skills]) => ({ domain, ...calculateATSScore(resumeText, skills), expectedSkills: skills }))
//       .reduce((best, current) => current.score > best.score ? current : best, { score: 0 });

//     const suggestions = await generateSuggestions(bestResult.matchingSkills, bestResult.expectedSkills, resumeText, bestResult.missingCoreSkills);

//     res.json({
//       domain: bestResult.domain,
//       atsScore: bestResult.score,
//       matchingSkills: bestResult.matchingSkills,
//       missingCoreSkills: bestResult.missingCoreSkills,
//       suggestions
//     });
//   } catch (error) {
//     console.error('Error processing resume:', error);
//     res.status(500).json({ error: 'Failed to process resume.' });
//   }
// });

// app.listen(3000, () => console.log('Server running on port 3000'));



const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

const AFFINDA_API_KEY = '63d5bb0bbf1971913acf160acd6cd78c82e18968375c921e6dce09d6db9b66fd'; // Replace with your API key
const AFFINDA_API_URL = 'https://api.affinda.com/v2/resumes/parse';

const expectedSkillsByDomain = {
  'Frontend Development': ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js', 'TypeScript', 'SASS', 'Bootstrap', 'Tailwind CSS', 'jQuery'],
  'Backend Development': ['Node.js', 'Express.js', 'Django', 'Flask', 'Ruby on Rails', 'PHP', 'Laravel', 'Spring Boot', 'ASP.NET'],
  'Database Management': ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Firebase', 'Redis'],
  'DevOps & Cloud': ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'AWS', 'Azure', 'Google Cloud Platform'],
  'Data Science & AI': ['Python', 'R', 'SQL', 'SAS', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Keras', 'XGBoost'],
  'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Java', 'Objective-C'],
  'UI/UX Design': ['Figma', 'Sketch', 'Adobe XD', 'Wireframing', 'Mockups', 'Interactive Prototypes'],
  'Cybersecurity & Networking': ['IT Security', 'Authentication', 'Authorization', 'Encryption', 'Networking Protocols'],
  'AI & Machine Learning': ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Neural Networks', 'Natural Language Processing', 'Computer Vision']
};

async function parseResumeWithAffinda(buffer) {
  try {
    const response = await axios.post(AFFINDA_API_URL, buffer, {
      headers: {
        'Authorization': `Bearer ${AFFINDA_API_KEY}`,
        'Content-Type': 'application/pdf'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error parsing resume with Affinda:', error);
    throw new Error('Failed to parse resume.');
  }
}

function calculateATSScore(parsedSkills, expectedSkills) {
  const matchingSkills = expectedSkills.filter(skill => parsedSkills.includes(skill));
  const missingCoreSkills = expectedSkills.filter(skill => !matchingSkills.includes(skill));

  const similarityScore = (matchingSkills.length / expectedSkills.length) * 100;
  const penalty = missingCoreSkills.length * 5;

  const finalScore = Math.max(0, Math.min(similarityScore - penalty, 100));
  return { score: finalScore, matchingSkills, missingCoreSkills };
}

app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const resumeData = await parseResumeWithAffinda(req.file.buffer);
    const parsedSkills = resumeData.data.skills.map(skill => skill.name);

    const bestResult = Object.entries(expectedSkillsByDomain)
      .map(([domain, skills]) => ({ domain, ...calculateATSScore(parsedSkills, skills), expectedSkills: skills }))
      .reduce((best, current) => current.score > best.score ? current : best, { score: 0 });

    res.json({
      domain: bestResult.domain,
      atsScore: bestResult.score,
      matchingSkills: bestResult.matchingSkills,
      missingCoreSkills: bestResult.missingCoreSkills
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: 'Failed to process resume.' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));