import { CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

const ProfileCompletionBadge = ({ profile }) => {
  const calculateCompletion = () => {
    if (!profile) return { percentage: 0, completed: 0, total: 0, items: [] };

    const items = [
      { label: "Personal Information", completed: !!(profile.firstName && profile.lastName) },
      { label: "Contact Information", completed: !!(profile.phone && profile.location) },
      { label: "Resume", completed: !!(profile.resumes && profile.resumes.length > 0) },
      { label: "Resume Analysis", completed: !!(profile.resumeAnalysis && profile.resumeAnalysis.score) },
      { label: "Skills", completed: !!(profile.skills && profile.skills.length > 0) },
      { label: "Experience", completed: !!(profile.experience && profile.experience.length > 0) },
      { label: "Education", completed: !!(profile.education && profile.education.length > 0) },
    ];

    const completed = items.filter((item) => item.completed).length;
    const total = items.length;
    const percentage = Math.round((completed / total) * 100);

    return { percentage, completed, total, items };
  };

  const completion = calculateCompletion();

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return "emerald";
    if (percentage >= 50) return "blue";
    if (percentage >= 30) return "yellow";
    return "red";
  };

  const color = getCompletionColor(completion.percentage);

  const colorStyles = {
    emerald: { icon: "text-emerald-600", text: "text-emerald-700", bar: "bg-emerald-600" },
    blue: { icon: "text-blue-600", text: "text-blue-700", bar: "bg-blue-600" },
    yellow: { icon: "text-yellow-600", text: "text-yellow-700", bar: "bg-yellow-500" },
    red: { icon: "text-red-600", text: "text-red-700", bar: "bg-red-600" },
  };

  const cs = colorStyles[color];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-900 font-medium">Profile Strength</h2>
        <TrendingUp className={`w-5 h-5 ${cs.icon}`} />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {completion.completed} of {completion.total} completed
          </span>
          <span className={`text-sm font-medium ${cs.text}`}>
            {completion.percentage}%
          </span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${cs.bar} transition-all duration-500`}
            style={{ width: `${completion.percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {completion.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {item.completed ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            <span className={item.completed ? "text-gray-900" : "text-gray-500"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {completion.percentage >= 80 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-900">
                Verified Profile
              </p>
              <p className="text-xs text-emerald-700">
                Your profile is strong and stands out to employers.
              </p>
            </div>
          </div>
        </div>
      )}

      {completion.percentage < 100 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-2">
            To improve your profile:
          </p>
          <ul className="space-y-1">
            {completion.items
              .filter((item) => !item.completed)
              .slice(0, 3)
              .map((item, index) => (
                <li key={index} className="text-sm text-gray-600">
                  • Add {item.label.toLowerCase()}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionBadge;
