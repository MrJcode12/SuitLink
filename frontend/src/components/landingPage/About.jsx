import {
  CheckCircle,
  Target,
  TrendingUp,
  Shield,
  FileText,
  Search,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Clear Application Status",
      description:
        "Track every stage of the hiring process in real time. Applicants and employers share a transparent, step-by-step view of application progress.",
    },
    {
      icon: Target,
      title: "Skill-Based Matching",
      description:
        "Align talent with opportunity using structured skill requirements. Job relevance is computed using explicit criteria, not opaque algorithms.",
    },
    {
      icon: Shield,
      title: "Employer Accountability",
      description:
        "Measure responsiveness and hiring behavior objectively. Applicants gain insight into employer engagement and decision timelines.",
    },
    {
      icon: FileText,
      title: "Smart Resume Management",
      description:
        "Upload, manage, and tailor multiple resume versions. Ensure each application aligns precisely with job-specific requirements.",
    },
    {
      icon: Search,
      title: "Focused Job Discovery",
      description:
        "Search with precision using filters for skills, location, and experience. Reduce noise and surface opportunities that are genuinely relevant.",
    },
    {
      icon: TrendingUp,
      title: "Auditability by Design",
      description:
        "Every hiring action is logged and traceable. Built to support fairness, reviewability, and responsible hiring practices.",
    },
  ];

  return (
    <section
      id="about"
      className="py-13 bg-gradient-to-br from-gray-50 via-stone-50 to-gray-100 border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-emerald-600 text-sm mb-4 uppercase tracking-wide">
            ABOUT
          </p>
          <h2 className="text-5xl text-black mb-6">
            Transparent hiring,{" "}
            <span className="text-gray-400">
              designed for clarity and fairness.
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl">
            A hiring platform that prioritizes accountability, structured
            workflows, and meaningful outcomes for both applicants and
            employers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl text-black flex-1">{feature.title}</h3>
                <div className="bg-emerald-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
                  <feature.icon className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
