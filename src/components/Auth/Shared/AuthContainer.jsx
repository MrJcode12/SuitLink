const AuthContainer = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {children}
    </div>
  );
};

export default AuthContainer;
