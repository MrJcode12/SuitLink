const AuthFormContainer = ({ children }) => {
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 min-h-screen lg:min-h-0">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthFormContainer;
