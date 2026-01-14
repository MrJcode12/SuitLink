import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-stone-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl text-black mb-6">Get started in 30 seconds.</h2>
        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Streamline your business and consolidate your projects, clients and
          team into one integrated, easy-to-use platform.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/login">
            <button className="bg-emerald-600 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors font-medium">
              Try SuitLink for free
            </button>
          </Link>
          <a
            href="#contact"
            className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-100 transition-colors font-medium border border-gray-300"
          >
            Contact sales
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
