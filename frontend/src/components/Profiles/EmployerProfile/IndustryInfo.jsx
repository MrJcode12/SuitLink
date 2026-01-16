const IndustryInfo = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg text-gray-900 mb-4">Industry</h2>
      <div className="space-y-2">
        <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
          Technology
        </span>
        <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm ml-2">
          SaaS
        </span>
      </div>
    </div>
  );
};

export default IndustryInfo;
