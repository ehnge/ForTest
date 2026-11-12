import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MetricCardData } from "../types/horizon";

export function TrendChart({ metric }: { metric: MetricCardData }) {
  return (
    <div className="h-48" role="img" aria-label={`${metric.label} trend chart`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={metric.points} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#91a8b8", fontSize: 10 }} />
          <YAxis domain={["auto", "auto"]} axisLine={false} tickLine={false} tick={{ fill: "#91a8b8", fontSize: 10 }} />
          <Tooltip contentStyle={{ background: "#14232e", border: "1px solid #3c5361", borderRadius: 10, fontSize: 12 }} labelStyle={{ color: "#b9d5dd" }} itemStyle={{ color: "#edf5f8" }} />
          <ReferenceLine y={metric.baseline} stroke="#7896ac" strokeDasharray="4 5" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#a1e5e5"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => (
              <circle key={payload.day} cx={cx} cy={cy} r={payload.alert ? 4 : 2} fill={payload.alert ? "#fbbf24" : "#a1e5e5"} />
            )}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
