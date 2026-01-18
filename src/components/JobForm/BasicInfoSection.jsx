const BasicInfoSection = ({ formData, onChange, errors }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg text-gray-900 mb-4">Basic Information</h3>

      <div className="space-y-4">
        {/* Job Title */}
        <div>
          <label htmlFor="title" className="block text-sm text-gray-700 mb-2">
            Job Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label
            htmlFor="employmentType"
            className="block text-sm text-gray-700 mb-2"
          >
            Employment Type <span className="text-red-600">*</span>
          </label>
          <select
            id="employmentType"
            value={formData.employmentType}
            onChange={(e) => onChange("employmentType", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          {errors.employmentType && (
            <p className="text-sm text-red-600 mt-1">{errors.employmentType}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm text-gray-700 mb-2"
          >
            Location <span className="text-red-600">*</span>
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="e.g., Manila, Philippines"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
          />
          {errors.location && (
            <p className="text-sm text-red-600 mt-1">{errors.location}</p>
          )}
        </div>

        {/* Remote */}
        <div className="flex items-center gap-3">
          <input
            id="remote"
            type="checkbox"
            checked={formData.remote}
            onChange={(e) => onChange("remote", e.target.checked)}
            className="w-4 h-4 text-chart-1 rounded focus:ring-chart-1"
          />
          <label htmlFor="remote" className="text-sm text-gray-700">
            Remote work available
          </label>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Salary Range (Optional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                value={formData.salaryRange.min}
                onChange={(e) =>
                  onChange("salaryRange", {
                    ...formData.salaryRange,
                    min: e.target.value,
                  })
                }
                placeholder="Min"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
              />
            </div>
            <div>
              <input
                type="number"
                value={formData.salaryRange.max}
                onChange={(e) =>
                  onChange("salaryRange", {
                    ...formData.salaryRange,
                    max: e.target.value,
                  })
                }
                placeholder="Max"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1"
              />
            </div>
          </div>
          {(errors["salaryRange.min"] || errors["salaryRange.max"]) && (
            <p className="text-sm text-red-600 mt-1">
              {errors["salaryRange.min"] || errors["salaryRange.max"]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
