import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { MetricCardData } from "../types/horizon";

export function MetricTile({ metric }: { metric: MetricCardData }) {
  const Icon = metric.trend === "up" ? ArrowUpRight : metric.trend === "down" ? ArrowDownRight : Minus;
  return <article className="tech-card p-4"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-[#ededed]">{metric.label}</p><Icon aria-hidden="true" className={metric.trend === "down" ? "text-[#ededed]" : "text-[#52a8ff]"} size={18} /></div><p className="mono-data mt-4 text-4xl font-semibold tracking-tight text-white">{metric.value}<span className="ml-1 text-sm font-medium text-[#999]">{metric.unit}</span></p><p className="mono-data mt-2 text-xs text-[#999]">Usual: {metric.baseline} {metric.unit}</p></article>;
}
