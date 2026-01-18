const TrustedCompanies = () => {
  const companies = [
    { name: "Verifiable", logo: "V" },
    { name: "BBC", logo: "BBC" },
    { name: "Whole Foods", logo: "WF" },
    { name: "The Guardian", logo: "TG" },
    { name: "Patreon", logo: "P" },
  ];

  const duplicatedCompanies = [...companies, ...companies, ...companies];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-stone-100 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-gray-500 mb-3">
          Trusted by leading companies
        </p>
        <p className="text-center text-sm text-gray-400 mb-12">
          to streamline their operations.
        </p>

        {/* Carousel Container with fade effects */}
        <div className="relative max-w-5xl mx-auto">
          {/* Left fade overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>

          {/* Right fade overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-100 to-transparent z-10 pointer-events-none"></div>

          <div className="overflow-hidden">
            <div className="flex gap-8 animate-scroll">
              {duplicatedCompanies.map((company, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-8 flex items-center justify-center border border-gray-200 hover:shadow-md transition-shadow min-w-[180px] flex-shrink-0"
                >
                  <span className="text-gray-400 font-medium">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-200px * 5));
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustedCompanies;
