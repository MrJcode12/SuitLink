const AboutCompany = ({ isEditing }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-900">About Company</h2>
        {isEditing && (
          <button className="text-sm text-emerald-600 hover:text-emerald-700">
            Edit
          </button>
        )}
      </div>
      <p className="text-gray-700 leading-relaxed">
        TechCorp is a leading technology company specializing in enterprise
        software solutions. We're committed to innovation, collaboration, and
        creating products that make a difference in people's lives.
      </p>
      <p className="text-gray-700 leading-relaxed">
        Our team of 800+ talented individuals works on cutting-edge projects
        that serve millions of users worldwide. We believe in fostering a
        culture of continuous learning and growth.
      </p>
    </div>
  );
};

export default AboutCompany;
