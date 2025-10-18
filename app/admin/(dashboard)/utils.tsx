import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Completed":
      return "default";
    case "InProgress":
      return "secondary";
    case "OnHold":
      return "outline";
    case "Pending":
      return "destructive";
    default:
      return "default";
  }
};

export const getGrowthIcon = (current: number, previous: number) => {
  if (current > previous) {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  } else if (current < previous) {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return <Activity className="h-4 w-4 text-gray-500" />;
};

export const getGrowthColor = (current: number, previous: number) => {
  if (current > previous) return "text-green-600";
  if (current < previous) return "text-red-600";
  return "text-gray-500";
};

export const calculateGrowthPercentage = (
  current: number,
  previous: number
) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return (((current - previous) / previous) * 100).toFixed(1);
};
