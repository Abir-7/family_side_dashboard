import { ItemsByStatusChart } from "@/components/custom/charts/Itemsbystatuschart";
import ActivityOverview from "@/components/custom/charts/line_chart_dashboard";
import DashboardStats from "@/components/custom/state_card/dashboard_state";
import { RecentFlaggedItems } from "@/components/custom/state_card/RecentFlaggedItems";
import { ToDoToday } from "@/components/custom/state_card/ToDoToday";
import { UpcomingEvents } from "@/components/custom/state_card/UpcomingEvents";
import { useGetDashboardOverviewQuery } from "@/lib/redux/apis/dashboardApi";
import { Loader2 } from "lucide-react";

export default function OverviewPage() {
  const { data: response, isLoading } = useGetDashboardOverviewQuery();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" /></div>;
  }

  const data = response?.data;

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

