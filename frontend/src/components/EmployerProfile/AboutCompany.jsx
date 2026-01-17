const AboutCompany = ({ companyProfile, isEditing }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-900">About Company</h2>
        {isEditing && (
          <button className="text-sm text-chart-1 hover:opacity-80">
            Edit
          </button>
        )}
      </div>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
        {companyProfile?.description || "No company description available."}
      </div>
    </div>
  );
};

export default AboutCompany;
