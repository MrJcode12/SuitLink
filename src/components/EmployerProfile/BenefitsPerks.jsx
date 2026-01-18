import { Award } from "lucide-react";

const BenefitsPerks = ({ isEditing }) => {
  const benefits = [
    "Health Insurance",
    "401(k) Matching",
    "Remote Work Options",
    "Learning Budget",
    "Unlimited PTO",
    "Gym Membership",
    "Stock Options",
    "Parental Leave",
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-900">Benefits & Perks</h2>
        {isEditing && (
          <button className="text-sm text-emerald-600 hover:text-emerald-700">
            Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
              <Award className="size-3 text-gray-700" />
            </div>
            <span className="text-sm text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsPerks;
