import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { MetricCardData } from "../types/horizon";

export function MetricTile({ metric }: { metric: MetricCardData }) {
  const Icon = metric.trend === "up" ? ArrowUpRight : metric.trend === "down" ? ArrowDownRight : Minus;
  return <article className="tech-card rev p-4"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-[#c2d0e4]">{metric.label}</p><Icon aria-hidden="true" className={metric.trend === "down" ? "text-[#f2c94c]" : "text-[#55e0f4]"} size={18} /></div><p className="mono-data mt-4 text-4xl font-semibold tracking-tight text-white">{metric.value}<span className="ml-1 text-sm font-medium text-[#91a4bf]">{metric.unit}</span></p><p className="mono-data mt-2 text-xs text-[#91a4bf]">Usual: {metric.baseline} {metric.unit}</p></article>;
}
