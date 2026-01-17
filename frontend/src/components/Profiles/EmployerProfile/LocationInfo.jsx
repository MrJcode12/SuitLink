const IndustryInfo = ({ profile, isEditing, value, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg text-gray-900 mb-4">Industry</h2>

      {isEditing ? (
        <div>
          <input
            type="text"
            value={value || ""}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="e.g., Technology, Healthcare, Finance"
          />
          <p className="mt-2 text-sm text-gray-500">+2 credibility points</p>
        </div>
      ) : (
        <div>
          {profile.industry ? (
            <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
              {profile.industry}
            </span>
          ) : (
            <p className="text-gray-500 text-sm">Not specified</p>
          )}
        </div>
      )}
    </div>
  );
};

export default IndustryInfo;
