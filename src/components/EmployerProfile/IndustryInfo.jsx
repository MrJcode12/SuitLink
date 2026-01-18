const IndustryInfo = ({ companyProfile }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg text-gray-900 mb-4">Industry</h2>
      <div className="space-y-2">
        {companyProfile?.industry ? (
          <span className="inline-block px-3 py-1.5 bg-emerald-50 text-chart-1 rounded-lg text-sm">
            {companyProfile.industry}
          </span>
        ) : (
          <p className="text-sm text-gray-500">No industry specified.</p>
        )}
      </div>
    </div>
  );
};

export default IndustryInfo;
