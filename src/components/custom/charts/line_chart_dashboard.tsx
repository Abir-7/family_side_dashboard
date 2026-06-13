/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "activities" | "events" | "users" | "gifts";
type Period = "2026" | "2025" | "2024";

const tabLabels: Record<Tab, string> = {
  activities: "Activity",
  events: "Events",
  users: "Users",
  gifts: "Gifts",
};

const periods: Period[] = ["2026", "2025", "2024"];

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white border border-gray-200 shadow-md px-3 py-2">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ActivityOverview() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("activities");
  const [period, setPeriod] = useState<Period>("2026");
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://10.10.12.60:8015/api/v1/admin/dashboard/chart?tab=${activeTab}&timeframe=${period}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const result = await response.json();
        if (result.status === "success") {
          setChartData(result.data.points);
        } else {
          toast.error(result.message || "Failed to load chart data");
        }
      } catch (error) {
        console.error("Chart error:", error);
        toast.error("An error occurred while fetching chart data");
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchChartData();
    }
  }, [accessToken, activeTab, period]);

  const data = chartData.map((point) => ({
    month: point.label,
    value: point.value,
  }));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 min-h-[460px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Activity overview
        </h2>

        {/* Period selector */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodMenu((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {period}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {showPeriodMenu && (
            <div className="absolute right-0 top-full mt-1 z-10 w-36 rounded-lg border border-gray-200 bg-white shadow-lg py-1">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setShowPeriodMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                    p === period
                      ? "text-green-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 mb-6">
        {(Object.keys(tabLabels) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <span className="text-sm text-gray-500">Loading chart...</span>
          </div>
        )}
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#86efac" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              dy={0}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#22c55e",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="linear"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#areaGradient)"
              dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }}
              activeDot={{
                r: 5,
                fill: "#22c55e",
                strokeWidth: 2,
                stroke: "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
