import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const evaluateResume = async (resumeText) => {
  const prompt = `
    You are a technical recruiter.

    Analyze the resume text below and evaluate its overall quality.

    Rules:
    - Do NOT extract skills
    - Do NOT rewrite the resume
    - Do NOT hallucinate experience
    - Be concise
    - Return VALID JSON ONLY

    JSON format:
    {
      "score": number (0-100),
      "seniority": "Junior" | "Mid" | "Senior",
      "strengths": [string],
      "weaknesses": [string],
      "suggestions": [string]
    }

    Resume text:
    """
    ${resumeText}
    """
    `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content);
};
