const FormSection = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg text-gray-900 mb-6">{title}</h2>
      {children}
    </div>
  );
};

export default FormSection;
