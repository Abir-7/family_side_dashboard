import { useEffect, useState } from "react";
import { ItemsByStatusChart } from "@/components/custom/charts/Itemsbystatuschart";
import ActivityOverview from "@/components/custom/charts/line_chart_dashboard";
import DashboardStats from "@/components/custom/state_card/dashboard_state";
import { RecentFlaggedItems } from "@/components/custom/state_card/RecentFlaggedItems";
import { ToDoToday } from "@/components/custom/state_card/ToDoToday";
import { UpcomingEvents } from "@/components/custom/state_card/UpcomingEvents";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";

interface DashboardData {
  pending_approvals: number;
  flagged_reviews: number;
  new_providers: number;
  total_users: {
    count: number;
    percentage_change: number;
    is_increase: boolean;
  };
  new_users_this_week: {
    count: number;
    percentage_change: number;
    is_increase: boolean;
  };
  activities: {
    count: number;
    percentage_change: number;
    is_increase: boolean;
  };
  events: {
    count: number;
    percentage_change: number;
    is_increase: boolean;
  };
  gifts: {
    count: number;
    percentage_change: number;
    is_increase: boolean;
  };
  status_distribution: {
    approved_pct: number;
    pending_pct: number;
    rejected_pct: number;
    flagged_pct: number;
  };
  recent_flagged: any[];
  pending_todo: any[];
  upcoming_events: any[];
}

export default function OverviewPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://10.10.12.60:8015/api/v1/admin/dashboard/overview", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = await response.json();
        if (result.status === "success") {
          setData(result.data);
        } else {
          toast.error(result.message || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("An error occurred while fetching dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchDashboardData();
    }
  }, [accessToken]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center min-h-[400px]">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <DashboardStats data={data} />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ActivityOverview />
        </div>
        <div className="">
          <ItemsByStatusChart
            data={[
              {
                name: "Approved",
                value: data.status_distribution.approved_pct,
                color: "#4CAF50",
              },
              {
                name: "Pending",
                value: data.status_distribution.pending_pct,
                color: "#FF9800",
              },
              {
                name: "Rejected",
                value: data.status_distribution.rejected_pct,
                color: "#F44336",
              },
              {
                name: "Flagged",
                value: data.status_distribution.flagged_pct,
                color: "#BDBDBD",
              },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecentFlaggedItems items={data.recent_flagged} />
        <ToDoToday items={data.pending_todo} />
        <UpcomingEvents items={data.upcoming_events} />
      </div>
    </div>
  );
}

