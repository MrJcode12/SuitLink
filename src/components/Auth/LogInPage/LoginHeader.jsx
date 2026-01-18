import { useNavigate } from "react-router-dom";

const LoginHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-normal mb-2 text-foreground">Sign in</h1>
      <p className="text-sm text-muted-foreground font-normal">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/signup")}
          className="font-normal hover:opacity-80 transition-opacity underline text-[#047857]"
        >
          Create now
        </button>
      </p>
    </div>
  );
};

export default LoginHeader;
