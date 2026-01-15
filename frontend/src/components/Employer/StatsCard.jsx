import { TrendingUp } from "lucide-react";

const StatsCard = ({
  icon: Icon,
  value,
  label,
  trend,
  badge,
  iconBgColor,
  iconColor,
}) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend ? (
          <TrendingUp className="w-5 h-5 text-chart-1" />
        ) : badge ? (
          <span
            className={`px-2 py-1 ${badge.bgColor} ${badge.textColor} text-xs rounded-full`}
          >
            {badge.text}
          </span>
        ) : null}
      </div>
      <div className="text-3xl font-medium text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default StatsCard;
