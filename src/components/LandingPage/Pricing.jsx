import { useState } from "react";
import { Check } from "lucide-react";

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const plans = [
    {
      name: "Starter",
      price: 0,
      description:
        "Perfect to explore with essential tools for individuals and small projects.",
      features: [
        "Basic access to platform",
        "Limited job posts per month",
        "Community support",
      ],
      buttonText: "Start for Free",
      buttonStyle: "bg-white text-black hover:bg-gray-100",
    },
    {
      name: "Pro",
      price: billingPeriod === "monthly" ? 29 : 290,
      description:
        "Advanced features and flexibility to scale productivity and handle bigger workloads.",
      features: [
        "Unlimited job postings",
        "Priority response time",
        "Early access to new features",
        "Advanced analytics",
      ],
      buttonText: "Upgrade to Pro",
      buttonStyle: "bg-white text-black hover:bg-gray-100",
      isPopular: true,
    },
    {
      name: "Custom",
      price: null,
      customLabel: "Custom",
      description:
        "Full power with custom options, priority support, and team-ready collaboration.",
      features: [
        "Dedicated workspace",
        "Advanced model tuning",
        "Premium support & SLA",
        "Custom integrations",
      ],
      buttonText: "Contact Sales",
      buttonStyle: "bg-white text-black hover:bg-gray-100",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-emerald-500 text-sm mb-4 uppercase tracking-wide">
            PRICING
          </p>
          <h2 className="text-5xl text-white mb-6">
            Choose the plan{" "}
            <span className="text-gray-500">that matches your ambition</span>
          </h2>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center gap-4 mb-12">
          <span
            className={`text-sm ${
              billingPeriod === "monthly" ? "text-white" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingPeriod(
                billingPeriod === "monthly" ? "yearly" : "monthly"
              )
            }
            className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors"
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                billingPeriod === "yearly" ? "translate-x-8" : "translate-x-1"
              }`}
            ></div>
          </button>
          <span
            className={`text-sm ${
              billingPeriod === "yearly" ? "text-white" : "text-gray-500"
            }`}
          >
            Yearly
            {billingPeriod === "yearly" && (
              <span className="text-xs bg-emerald-600 text-white mx-2 px-2 py-1 rounded">
                20% OFF
              </span>
            )}
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border ${
                plan.isPopular ? "border-emerald-500/50" : "border-gray-700"
              } relative`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-8">
                  <span className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl text-white mb-4">{plan.name}</h3>

              <div className="mb-6">
                {plan.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl text-white">€{plan.price}</span>
                    <span className="text-gray-400">
                      /{billingPeriod === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                ) : (
                  <div className="text-5xl text-white">{plan.customLabel}</div>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                {plan.description}
              </p>

              <button
                className={`w-full py-3 rounded-lg transition-colors font-medium mb-8 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>

              <div className="space-y-4">
                <p className="text-gray-500 text-sm mb-4">Features</p>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
