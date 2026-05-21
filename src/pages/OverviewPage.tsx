import { ItemsByStatusChart } from "@/components/custom/charts/Itemsbystatuschart";
import ActivityOverview from "@/components/custom/charts/line_chart_dashboard";
import DashboardStats from "@/components/custom/state_card/dashboard_state";

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      <DashboardStats />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ActivityOverview />
        </div>
        <div className="">
          <ItemsByStatusChart
            data={[
              {
                name: "Approved",
                value: 45,
                color: "#4CAF50",
              },
              {
                name: "Pending",
                value: 20,
                color: "#FF9800",
              },
              {
                name: "Rejected",
                value: 25,
                color: "#F44336",
              },
              {
                name: "Flagged",
                value: 10,
                color: "#BDBDBD",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
