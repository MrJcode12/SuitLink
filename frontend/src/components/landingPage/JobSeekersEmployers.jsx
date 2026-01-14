import { useState } from "react";
import { Link } from "react-router-dom";

const JobSeekersEmployers = () => {
  const [activeTab, setActiveTab] = useState("jobseekers");

  return (
    <section
      id="job-seekers"
      className="py-24 bg-white border-t border-gray-200"
    >
      <div id="job-seekers" className="absolute -top-20"></div>
      <div id="employers" className="absolute -top-20"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Tab Buttons Container */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-emerald-700 rounded-2xl p-16">
            <div className="flex gap-4 mb-16">
              <button
                onClick={() => setActiveTab("jobseekers")}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  activeTab === "jobseekers"
                    ? "bg-white text-emerald-700 font-medium"
                    : "text-white hover:bg-emerald-600"
                }`}
              >
                For Jobseekers
              </button>
              <button
                onClick={() => setActiveTab("employers")}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  activeTab === "employers"
                    ? "bg-white text-emerald-700 font-medium"
                    : "text-white hover:bg-emerald-600"
                }`}
              >
                For Employers
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === "jobseekers" ? (
              <div>
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                  {/* Left side - Content */}
                  <div>
                    <p className="text-emerald-200 text-sm mb-3 uppercase tracking-wide">
                      FOR JOBSEEKERS
                    </p>
                    <h2 className="text-4xl text-white mb-6">
                      Start your career journey
                    </h2>
                    <p className="text-emerald-100 mb-8 leading-relaxed">
                      Discover verified job opportunities and access
                      professional resources to help you succeed in your career
                      development.
                    </p>
                    <Link to="/login">
                      <button className="bg-white text-emerald-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                        Get Started
                      </button>
                    </Link>
                  </div>

                  {/* Right side - Image */}
                  <div className="relative">
                    <div className="bg-white rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1678871482507-304592cf41de?q=80&w=764&auto=format&fit=crop"
                        alt="Professional working on laptop"
                        className="w-full h-[350px] object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Impact Numbers */}
                <div className="border-t border-emerald-600/30 pt-12">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-4xl text-white font-medium mb-2">
                        1,000+
                      </p>
                      <p className="text-emerald-200 text-sm">
                        Companies trust SuitLink for hiring
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl text-emerald-300 font-medium mb-2">
                        95%
                      </p>
                      <p className="text-emerald-200 text-sm">
                        Client Satisfaction Rate
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl text-white font-medium mb-2">
                        100K+
                      </p>
                      <p className="text-emerald-200 text-sm">
                        Job opportunities created
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl text-emerald-300 font-medium mb-2">
                        50K+
                      </p>
                      <p className="text-emerald-200 text-sm">
                        Resumes processed efficiently
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <section id="employers">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                  {/* Left side - Content */}
                  <div>
                    <p className="text-emerald-200 text-sm mb-3 uppercase tracking-wide">
                      FOR EMPLOYERS
                    </p>
                    <h2 className="text-4xl text-white mb-6">
                      Find the right talent faster
                    </h2>
                    <p className="text-emerald-100 mb-8 leading-relaxed">
                      Connect with qualified candidates and streamline your
                      recruitment process with our comprehensive hiring
                      platform.
                    </p>
                    <Link to="/login">
                      <button className="bg-white text-emerald-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                        Get Started
                      </button>
                    </Link>
                  </div>

                  {/* Right side - Image */}
                  <div className="relative">
                    <div className="bg-white rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1681993608480-36d3226ecf71?q=80&w=1470&auto=format&fit=crop"
                        alt="Professional team meeting"
                        className="w-full h-[350px] object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Impact Numbers */}
                <div className="border-t border-emerald-600/30 pt-12">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-4xl text-white font-medium mb-2">
                        1,000+
                      </p>
                      <p className="text-emerald-200 text-sm">
                        Companies trust SuitLink for hiring
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl text-emerald-300 font-medium mb-2">
                        95%
                      </p>
                      <p className="text-emerald-200 text-sm">
                        Client Satisfaction Rate
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl text-white font-medium mb-2">
                        100K+
                      </p>
                      <p className="text-emerald-200 text-sm">
                        Job opportunities created
                      </p>
                    </div>
                    <div>
                      <p className="text-4xl text-emerald-300 font-medium mb-2">
                        50K+
                      </p>
                      <p className="text-emerald-200 text-sm">
                        Resumes processed efficiently
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSeekersEmployers;
