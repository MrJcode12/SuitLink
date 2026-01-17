import { TrendingUp } from "lucide-react";

const StatsCard = ({ icon: Icon, value, label, trend, badge }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 size-6 text-emerald-700`} />
        </div>
        {trend ? (
          <TrendingUp className="size-5 text-emerald-600" />
        ) : badge ? (
          <span
            className={`px-2 py-1 ${badge.bgColor} ${badge.textColor} text-xs rounded-full`}
          >
            {badge.text}
          </span>
        ) : null}
      </div>
      <div className="text-3xl text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

export default StatsCard;
