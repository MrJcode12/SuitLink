import { Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const categories = [
    "Digital Marketing",
    "UI/UX Design",
    "Affiliate Marketing",
    "User Experience Design",
    "Health",
    "Art Studio",
    "Business & Finance",
    "Information Technology",
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-stone-100 py-40 pb-40 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-6000"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-8000"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Job Opportunities Badge */}
          <div className="inline-flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white"></div>
            </div>
            <div className="text-left">
              <p className="text-gray-600 text-lg font-medium">
                70K+ Job opportunities
              </p>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl text-black mb-6">
            Find the perfect profession for you
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Get more than 5000+ active jobs for both local & globally
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-xl p-2 flex flex-col md:flex-row gap-2 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 flex-1 border-r border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by keyword, skill or interest"
                className="flex-1 outline-none text-gray-900"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 flex-1">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location or Postcode"
                className="flex-1 outline-none text-gray-900"
              />
            </div>
            <Link to="/login">
              <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                Search
              </button>
            </Link>
          </div>
        </div>

        {/* Popular Search Section */}
        <div className="mt-12 relative">
          <h2 className="text-2xl text-black text-center mb-8 relative inline-block left-1/2 -translate-x-1/2">
            Popular Search
            {/* Animated Magnifying Glass */}
            <div className="absolute -top-2 left-20 z-20 pointer-events-none animate-search-slide">
              <div className="relative w-16 h-16">
                {/* Magnifying glass circle */}
                <div className="w-12 h-12 border-3 border-emerald-500 rounded-full relative bg-gradient-to-br from-white/20 to-transparent overflow-hidden">
                  {/* Multiple shine effects for depth */}
                  <div className="absolute top-1 left-2 w-4 h-4 bg-white rounded-full opacity-40 blur-sm"></div>
                  <div className="absolute top-1.5 left-2.5 w-2 h-2 bg-white rounded-full opacity-80"></div>
                  {/* Subtle edge highlight */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
                </div>
                {/* Handle */}
                <div
                  className="absolute top-8 left-8 w-8 h-1.5 bg-emerald-500 rounded-full shadow-sm"
                  style={{
                    transform: "rotate(45deg)",
                    transformOrigin: "left center",
                  }}
                ></div>
              </div>
            </div>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes search-slide {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(40px);
          }
        }

        .animate-blob {
          animation: blob 20s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        .animation-delay-8000 {
          animation-delay: 8s;
        }

        .animate-search-slide {
          animation: search-slide 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
