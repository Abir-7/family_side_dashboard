/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface ItemsByStatusChartProps {
  data?: StatusData[];
  title?: string;
}

const defaultData: StatusData[] = [
  { name: "Approved", value: 66, color: "#4CAF50" },
  { name: "Pending", value: 66, color: "#FF9800" },
  { name: "Rejected", value: 66, color: "#F44336" },
  { name: "Flagged", value: 66, color: "#BDBDBD" },
];

const legendDotClass: Record<string, string> = {
  Approved: "bg-green-500",
  Pending: "bg-orange-400",
  Rejected: "bg-red-500",
  Flagged: "bg-gray-400",
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}: any) => {
  if (value === 0) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <rect
        x={x - 18}
        y={y - 11}
        width={36}
        height={22}
        rx={11}
        ry={11}
        fill="rgba(255,255,255,0.28)"
      />
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${value}%`}
      </text>
    </g>
  );
};

export function ItemsByStatusChart({
  data = defaultData,
  title = "Items by status",
}: ItemsByStatusChartProps) {
  return (
    <div className="flex h-full w-full border flex-col items-center bg-white rounded-2xl  px-6 pt-5 pb-6">
      {/* Title */}
      <p className="text-sm font-semibold text-gray-900 mb-3">{title}</p>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mb-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${legendDotClass[item.name] ?? ""}`}
              style={
                !legendDotClass[item.name]
                  ? { background: item.color }
                  : undefined
              }
            />
            <span className="text-xs text-gray-500">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Donut — fills remaining space */}
      <div className="w-full flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.filter((item) => item.value > 0)}
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="75%"
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              startAngle={90}
              endAngle={-270}
            >
              {data
                .filter((item) => item.value > 0)
                .map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
