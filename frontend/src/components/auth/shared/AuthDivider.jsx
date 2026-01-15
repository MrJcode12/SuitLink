const AuthDivider = ({ text = "OR" }) => {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#D1D5DB]" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 text-xs font-normal bg-background text-[#9CA3AF]">
          {text}
        </span>
      </div>
    </div>
  );
};

export default AuthDivider;
