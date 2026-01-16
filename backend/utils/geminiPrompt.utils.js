export const buildResumePrompt = (resumeText) => 
  `You are an ATS or an Applicant Tracking System.
  
  Extract information from the resume text below.
  
  STRICT RULES:
  - Return VALID JSON ONLY
  - No markdown
  - No explanations
  - No trailing text
  - Do NOT infer or guess information not explicitly present
  
  JSON schema:
  {
    "skills": [string],
    "roles": [string],
    "yearsOfExperience": number
  }
    
  Normalization rules:
  - Normalize skills (ex. "Node", "NodeJS" -> "Node.js")
  - Deduplicate skills
  - yearsOfExperience must be a NUMBER, not a string (0 if unknown)
  
  Resume text:
  """
  ${resumeText}
  """
  `;