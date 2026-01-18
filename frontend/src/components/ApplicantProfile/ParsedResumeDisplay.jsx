import { Award, TrendingUp } from "lucide-react";

const ParsedResumeDisplay = ({ profile }) => {
  const resumeAnalysis = profile?.resumeAnalysis;

  const getScoreTheme = (score) => {
    if (score >= 80)
      return {
        ring: "border-emerald-200",
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        pill: "bg-emerald-600 text-white",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dot: "bg-emerald-600",
      };

    if (score >= 60)
      return {
        ring: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-800",
        pill: "bg-blue-600 text-white",
        badge: "bg-blue-50 text-blue-800 border-blue-200",
        dot: "bg-blue-600",
      };

    if (score >= 40)
      return {
        ring: "border-yellow-200",
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        pill: "bg-yellow-500 text-white",
        badge: "bg-yellow-50 text-yellow-800 border-yellow-200",
        dot: "bg-yellow-500",
      };

    return {
      ring: "border-red-200",
      bg: "bg-red-50",
      text: "text-red-800",
      pill: "bg-red-600 text-white",
      badge: "bg-red-50 text-red-800 border-red-200",
      dot: "bg-red-600",
    };
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  if (!resumeAnalysis) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg text-gray-900 font-medium">
              Resume Analysis
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload a resume to generate AI-powered insights.
            </p>
          </div>
        </div>

        <div className="text-center py-10">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Award className="w-7 h-7 text-gray-500" />
          </div>
          <p className="text-sm text-gray-600">
            No analysis available yet.
          </p>
        </div>
      </div>
    );
  }

  const theme = getScoreTheme(resumeAnalysis.score);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg text-gray-900 font-medium">Resume Analysis</h2>
          <p className="text-sm text-gray-600 mt-1">
            Summary insights based on your most recent resume upload.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          AI-Powered
        </div>
      </div>

      <div className={`rounded-2xl border ${theme.ring} ${theme.bg} p-5 mb-6`}>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Overall Score</p>
            <p className="text-3xl font-semibold text-gray-900">
              {resumeAnalysis.score}
              <span className="text-base font-normal text-gray-600">/100</span>
            </p>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${theme.badge} border`}
              >
                {getScoreLabel(resumeAnalysis.score)}
              </span>
            </div>
          </div>

          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center ${theme.pill}`}
          >
            <span className="text-2xl font-semibold">{resumeAnalysis.score}</span>
          </div>
        </div>
      </div>

      {resumeAnalysis.seniority && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Seniority Level</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-800">
            <Award className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-medium">{resumeAnalysis.seniority}</span>
          </div>
        </div>
      )}

      {resumeAnalysis.strengths?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
            <h3 className="text-sm font-medium text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {resumeAnalysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-emerald-700 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resumeAnalysis.weaknesses?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <h3 className="text-sm font-medium text-gray-900">
              Areas for Improvement
            </h3>
          </div>
          <ul className="space-y-2">
            {resumeAnalysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-orange-600 mt-0.5">!</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resumeAnalysis.suggestions?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {resumeAnalysis.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-600 mt-0.5">→</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile?.resumeAnalyzedAt && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Analyzed on {new Date(profile.resumeAnalyzedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ParsedResumeDisplay;
