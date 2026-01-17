const AboutCompany = ({ profile, isEditing, value, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-900">About Company</h2>
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={value || ""}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            rows={6}
            placeholder="Describe your company, culture, mission, and what makes you unique..."
          />
          <p className="mt-2 text-sm text-gray-500">
            A good description helps candidates understand your company (+2
            credibility points)
          </p>
        </div>
      ) : (
        <div>
          {profile.description ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {profile.description}
            </p>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No company description yet</p>
              <p className="text-sm text-gray-400">
                Add a description to increase your credibility score
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AboutCompany;
