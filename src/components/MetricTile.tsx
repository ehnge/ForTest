import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { MetricCardData } from "../types/horizon";

export function MetricTile({ metric }: { metric: MetricCardData }) {
  const Icon = metric.trend === "up" ? ArrowUpRight : metric.trend === "down" ? ArrowDownRight : Minus;
  return <article className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4 shadow-lg shadow-black/10"><div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-slate-300">{metric.label}</p><Icon aria-hidden="true" className={metric.trend === "down" ? "text-amber-200" : "text-cyan-200"} size={18} /></div><p className="mt-4 text-3xl font-semibold tracking-tight text-white">{metric.value}<span className="ml-1 text-base font-medium text-slate-400">{metric.unit}</span></p><p className="mt-2 text-sm text-slate-400">Usual: {metric.baseline} {metric.unit}</p></article>;
}
