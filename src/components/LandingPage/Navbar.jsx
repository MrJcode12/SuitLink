import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            <span className="text-xl font-semibold text-black">SuitLink</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#job-seekers"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Job Seekers
            </a>
            <a
              href="#job-seekers"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Employers
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-black transition-colors"
            >
              About
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-black transition-colors"
            >
              Contact us
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/login">
              <button className="text-gray-700 hover:text-black transition-colors">
                Log in
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
