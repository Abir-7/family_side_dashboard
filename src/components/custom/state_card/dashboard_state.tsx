"use client";

import {
  Clock,
  Flag,
  UserRound,
  Users,
  UserPlus,
  CalendarCheck,
  CalendarDays,
  Gift,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  linkLabel?: string;
  onLinkClick?: () => void;
  trend?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  cardBg: string;
  borderColor: string;
  linkColor?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  linkLabel,
  onLinkClick,
  trend,
  icon: Icon,
  iconColor,
  iconBg,
  cardBg,
  borderColor,
  linkColor = "text-blue-500",
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border ${borderColor} ${cardBg} p-5 flex flex-col gap-2 min-w-0`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg} shrink-0 mt-0.5`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-gray-800 leading-tight">
            {value}
          </p>
          <p className="text-sm font-medium text-gray-700 mt-0.5">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {linkLabel && (
        <button
          onClick={onLinkClick}
          className={`flex items-center gap-1 text-xs font-medium ${linkColor} hover:underline mt-1 w-fit`}
        >
          {linkLabel}
          <ArrowRight className="h-3 w-3" />
        </button>
      )}

      {trend && (
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-500">{trend}</span>
        </div>
      )}
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function DashboardStats({ data }: { data: any }) {
  const stats = [
    {
      title: "Pending approvals",
      value: data.pending_approvals,
      subtitle: "Activity & Events",
      linkLabel: "Reviews",
      linkColor: "text-red-400",
      icon: Clock,
      iconColor: "text-red-400",
      iconBg: "bg-red-100",
      cardBg: "bg-red-50",
      borderColor: "border-red-100",
    },
    {
      title: "Flagged reviews",
      value: data.flagged_reviews,
      subtitle: "Require attention",
      linkLabel: "View",
      linkColor: "text-yellow-500",
      icon: Flag,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-100",
      cardBg: "bg-yellow-50",
      borderColor: "border-yellow-100",
    },
    {
      title: "New providers",
      value: data.new_providers,
      subtitle: "This week join",
      linkLabel: "View all",
      linkColor: "text-blue-500",
      icon: UserRound,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-100",
      cardBg: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      title: "Total Users",
      value: data.total_users.count,
      trend: `${data.total_users.percentage_change}% vs last week`,
      icon: Users,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-100",
      cardBg: "bg-purple-50",
      borderColor: "border-purple-100",
    },
    {
      title: "New Users",
      value: data.new_users_this_week.count,
      trend: `${data.new_users_this_week.percentage_change}% vs last week`,
      icon: UserPlus,
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
      cardBg: "bg-green-50",
      borderColor: "border-green-100",
    },
    {
      title: "Activity",
      value: data.activities.count,
      trend: `${data.activities.percentage_change}% vs last week`,
      icon: CalendarCheck,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-100",
      cardBg: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      title: "Events",
      value: data.events.count,
      trend: `${data.events.percentage_change}% vs last week`,
      icon: CalendarDays,
      iconColor: "text-red-400",
      iconBg: "bg-red-100",
      cardBg: "bg-red-50",
      borderColor: "border-red-100",
    },
    {
      title: "Gift",
      value: data.gifts.count,
      trend: `${data.gifts.percentage_change}% vs last week`,
      icon: Gift,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-100",
      cardBg: "bg-orange-50",
      borderColor: "border-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          {...stat}
          onLinkClick={() =>
            console.log(`Clicked: ${stat.linkLabel} on ${stat.title}`)
          }
        />
      ))}
    </div>
  );
}
