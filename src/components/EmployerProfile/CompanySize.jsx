const CompanySize = ({ companyProfile }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg text-gray-900 mb-4">Company Size</h2>
      <p className="text-gray-700">
        {companyProfile?.companySize || "Not specified"}
      </p>
    </div>
  );
};

export default CompanySize;
