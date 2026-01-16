import { credibilityPoints } from "../config/companyCredibility.config.js";

export const calculateCompanyCredibility = (companyProfile) => {
  let score = 0;

  for (const field in credibilityPoints) {
    const points = credibilityPoints[field];

    if (field === 'logo') {
      if (companyProfile.logo?.url) {
        score += points;
      }

      continue;
    }

    const value = companyProfile[field];

    if (typeof value === 'string' && value.trim().length > 0) {
      score += points;
    }
  }

  return score;
}