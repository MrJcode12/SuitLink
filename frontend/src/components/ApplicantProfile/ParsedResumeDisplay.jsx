import { Briefcase, GraduationCap, Award, TrendingUp } from "lucide-react";

const ParsedResumeDisplay = ({ profile }) => {
  const resumeAnalysis = profile?.resumeAnalysis;

  if (!resumeAnalysis) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg text-gray-900 font-medium mb-4">
          Resume Analysis
        </h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            Upload a resume to see AI-powered analysis
          </p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-gray-900 font-medium">Resume Analysis</h2>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <span className="text-sm text-gray-600">AI-Powered</span>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Overall Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {resumeAnalysis.score}/100
            </p>
            <p
              className={`text-sm font-medium mt-1 ${
                getScoreColor(resumeAnalysis.score).split(" ")[0]
              }`}
            >
              {getScoreLabel(resumeAnalysis.score)}
            </p>
          </div>
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreColor(
              resumeAnalysis.score
            )}`}
          >
            <span className="text-2xl font-bold">{resumeAnalysis.score}</span>
          </div>
        </div>
      </div>

      {/* Seniority Level */}
      {resumeAnalysis.seniority && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Seniority Level</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
            <Award className="w-4 h-4" />
            <span className="font-medium">{resumeAnalysis.seniority}</span>
          </div>
        </div>
      )}

      {/* Strengths */}
      {resumeAnalysis.strengths && resumeAnalysis.strengths.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
            <h3 className="text-sm font-medium text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {resumeAnalysis.strengths.map((strength, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-emerald-600 mt-1">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {resumeAnalysis.weaknesses && resumeAnalysis.weaknesses.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-orange-600"></div>
            <h3 className="text-sm font-medium text-gray-900">
              Areas for Improvement
            </h3>
          </div>
          <ul className="space-y-2">
            {resumeAnalysis.weaknesses.map((weakness, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-orange-600 mt-1">!</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {resumeAnalysis.suggestions && resumeAnalysis.suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <h3 className="text-sm font-medium text-gray-900">Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {resumeAnalysis.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-blue-600 mt-1">→</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis Timestamp */}
      {profile.resumeAnalyzedAt && (
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
