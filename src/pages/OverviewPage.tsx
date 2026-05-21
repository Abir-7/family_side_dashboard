import ActivityOverview from "@/components/custom/chats/line_chart_dashboard";
import DashboardStats from "@/components/custom/state_card/dashboard_state";

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      <DashboardStats />
      <ActivityOverview />
    </div>
  );
}
