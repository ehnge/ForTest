import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MetricCardData } from "../types/horizon";

export function TrendChart({ metric }: { metric: MetricCardData }) {
  return (
    <div className="h-48" role="img" aria-label={`${metric.label} trend chart`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={metric.points} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis domain={["auto", "auto"]} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip contentStyle={{ background: "#10182b", border: "1px solid #334155", borderRadius: 12 }} labelStyle={{ color: "#dbeafe" }} itemStyle={{ color: "#f8fafc" }} />
          <ReferenceLine y={metric.baseline} stroke="#93c5fd" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#67e8f9"
            strokeWidth={3}
            dot={({ cx, cy, payload }) => (
              <circle cx={cx} cy={cy} r={payload.alert ? 5 : 3} fill={payload.alert ? "#fbbf24" : "#67e8f9"} />
            )}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
