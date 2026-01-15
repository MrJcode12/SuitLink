const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  error,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-gray-700 mb-2">
        {label} {required && <span className="text-gray-700">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
        required={required}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-gray-700 mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
