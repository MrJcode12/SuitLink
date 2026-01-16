import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildResumePrompt } from '../utils/geminiPrompt.utils.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractResumeData = async (resumeText) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-pro',
    generationConfig: {
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 1024,
    }
  });

  const prompt = buildResumePrompt(resumeText);

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error('Gemini did not return valid JSON');
  }

  return JSON.parse(raw.slice(start, end + 1));
}