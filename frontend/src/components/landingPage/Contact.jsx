import { ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-emerald-800 to-emerald-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left side - Form */}
          <div>
            <div className="mb-8">
              <span className="text-emerald-300 text-sm mb-4">
                ● Contact us
              </span>
              <h2 className="text-5xl text-white mt-4 mb-6 leading-tight">
                Get in touch with our experts team
              </h2>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-emerald-700/30 border border-emerald-600/30 rounded-lg px-4 py-3 text-white placeholder-emerald-300/70 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-emerald-700/30 border border-emerald-600/30 rounded-lg px-4 py-3 text-white placeholder-emerald-300/70 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="date"
                    placeholder="mm/dd/yyyy"
                    className="w-full bg-emerald-700/30 border border-emerald-600/30 rounded-lg px-4 py-3 text-white placeholder-emerald-300/70 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <select className="w-full bg-emerald-700/30 border border-emerald-600/30 rounded-lg px-4 py-3 text-emerald-300/70 focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                    <option>Service...</option>
                    <option>Job Seeker Support</option>
                    <option>Employer Solutions</option>
                    <option>Technical Support</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  placeholder="How Can We Help?"
                  rows={4}
                  className="w-full bg-emerald-700/30 border border-emerald-600/30 rounded-lg px-4 py-3 text-white placeholder-emerald-300/70 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-white text-emerald-800 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
              >
                Submit your Form
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1724260793422-7754e5d06fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2V0JTIwc3VwcG9ydHxlbnwxfHx8fDE3NjgwMzkxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Customer support professional"
                className="w-full h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
