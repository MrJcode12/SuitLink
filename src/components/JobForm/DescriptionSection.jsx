const DescriptionSection = ({ formData, onChange, errors }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg text-gray-900 mb-4">Job Description</h3>

      <div>
        <label
          htmlFor="description"
          className="block text-sm text-gray-700 mb-2"
        >
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe the role, responsibilities, and what you're looking for..."
          rows={10}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 resize-none"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {formData.description.length} / 5000 characters
        </p>
      </div>
    </div>
  );
};

export default DescriptionSection;
