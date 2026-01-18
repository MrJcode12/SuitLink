import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Logo = ({ to = "/" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity"
    >
      <Briefcase className="w-5 h-5 text-[#047857]" />
      <span className="text-base font-normal">SuitLink</span>
    </button>
  );
};

export default Logo;
