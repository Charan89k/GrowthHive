"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IncompleteState } from "./IncompleteState";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import type { Lead, AuditResult } from "@/lib/types";

const COLORS = ["#EF4444", "#F59E0B", "#22C55E"]; // Destructive, Warning, Success
const PIE_COLORS = ["#3B82F6", "#22D3EE", "#22C55E", "#F59E0B", "#EF4444"];

export function AnalyticsView({
  leads,
  audits,
  onNavigate,
}: {
  leads: Lead[];
  audits: Record<string, AuditResult>;
  onNavigate: (tab: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const auditedLeads = useMemo(() => {
    return leads.filter((l) => audits[l.id]);
  }, [leads, audits]);

  // PageSpeed distributions
  const pagespeedDistribution = useMemo(() => {
    let poor = 0; // < 50
    let average = 0; // 50-89
    let good = 0; // >= 90
    
    auditedLeads.forEach((l) => {
      const a = audits[l.id];
      if (a.hasWebsite) {
        if (a.pageSpeedScore < 50) poor++;
        else if (a.pageSpeedScore < 90) average++;
        else good++;
      } else {
        poor++; // No site at all acts as poor
      }
    });

    return [
      { name: "Poor (<50)", value: poor },
      { name: "Average (50-89)", value: average },
      { name: "Good (90+)", value: good },
    ];
  }, [auditedLeads, audits]);

  // Revenue loss ranking
  const revenueLossData = useMemo(() => {
    return auditedLeads
      .map((l) => ({
        name: l.name.length > 15 ? l.name.substring(0, 15) + "..." : l.name,
        revenueLoss: audits[l.id].estLostRevenuePerMonth,
      }))
      .sort((a, b) => b.revenueLoss - a.revenueLoss)
      .slice(0, 8);
  }, [auditedLeads, audits]);

  // Gaps distribution
  const gapDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    auditedLeads.forEach((l) => {
      const a = audits[l.id];
      a.gaps.forEach((gap) => {
        // Clean gap name for chart
        let label = gap;
        if (gap.includes("PageSpeed")) label = "Slow PageSpeed";
        if (gap.includes("load time")) label = "Slow PageSpeed";
        counts[label] = (counts[label] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [auditedLeads, audits]);

  if (auditedLeads.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl text-foreground">Analytics</h1>
        <IncompleteState
          title="No audits available"
          description="Analytics charts require audited leads to calculate performance scores, revenue leakage, and optimization gaps. Complete the audit phase first."
          prevPhaseLabel="Audit"
          onPrev={() => onNavigate("audit")}
        />
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl sm:text-4xl text-foreground">Insights & Analytics</h1>
        <p className="text-muted-foreground text-sm">Visual analysis of conversion gaps, speed distributions, and monthly revenue leakage.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PageSpeed Performance distribution */}
        <Card className="bg-[#111111] border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-medium">PageSpeed Health</CardTitle>
            <CardDescription className="text-xs">Count of leads grouped by mobile PageSpeed Insights score</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pagespeedDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pagespeedDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                  itemStyle={{ color: "#F4F4F5" }}
                />
                <Legend formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Common Conversion Gaps */}
        <Card className="bg-[#111111] border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-medium">Top Conversion Gaps</CardTitle>
            <CardDescription className="text-xs">Most frequent optimizations required across scanned leads</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gapDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${typeof percent === "number" ? (percent * 100).toFixed(0) : "0"}%)`}
                  outerRadius={75}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gapDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                  itemStyle={{ color: "#F4F4F5" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Leakage comparison */}
      <Card className="bg-[#111111] border-white/5 shadow-xl">
        <CardHeader>
          <CardTitle className="text-base font-medium">Monthly Revenue Gaps</CardTitle>
          <CardDescription className="text-xs">Estimated monthly revenue lost due to web performance and local booking gaps (Top 8 prospects)</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueLossData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#A1A1AA", fontSize: 10 }}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => `₹${value / 1000}k`}
                tick={{ fill: "#A1A1AA", fontSize: 10 }}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: unknown) => [typeof value === "number" ? `₹${value.toLocaleString("en-IN")}` : "—", "Est. Revenue Loss"]}
                contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                itemStyle={{ color: "#F4F4F5" }}
                labelStyle={{ color: "#A1A1AA", fontSize: 11 }}
              />
              <Bar dataKey="revenueLoss" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                {revenueLossData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#22D3EE" : "#3B82F6"} // Highlight rank 1
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
