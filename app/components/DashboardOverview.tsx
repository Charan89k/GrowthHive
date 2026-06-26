"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, Play, ShieldAlert, Zap, Users, ArrowRight, Activity } from "lucide-react";
import type { Lead, AuditResult } from "@/lib/types";
import { BRANDING } from "@/lib/branding";

export function DashboardOverview({
  leads,
  audits,
  logs,
  onNavigate,
  selectedId,
}: {
  leads: Lead[];
  audits: Record<string, AuditResult>;
  logs: string[];
  onNavigate: (tab: string) => void;
  selectedId: string | null;
}) {
  const auditedCount = Object.keys(audits).length;
  const noSiteCount = Object.values(audits).filter((a) => !a.hasWebsite).length;
  const avgSpeed = auditedCount
    ? Math.round(Object.values(audits).reduce((s, a) => s + a.pageSpeedScore, 0) / auditedCount)
    : 0;
  const totalLost = Object.values(audits).reduce((s, a) => s + (a?.estLostRevenuePerMonth ?? 0), 0);

  const recentAudits = useMemo(() => {
    return leads
      .filter((l) => audits[l.id])
      .slice(0, 4)
      .map((l) => ({ lead: l, audit: audits[l.id] }));
  }, [leads, audits]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/5 bg-gradient-to-r from-primary/10 via-accent-foreground/5 to-transparent p-8 md:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
            Welcome to {BRANDING.appName}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed">
            Scan local businesses, run full PageSpeed audits, rank them by high-value revenue gaps, and generate code-ready landing pages with outreach.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => onNavigate("scrape")} className="h-10 px-5 gap-2 cursor-pointer shadow-lg shadow-primary/20">
              <Play className="h-4 w-4 fill-current" /> Get Started
            </Button>
            <Button variant="outline" onClick={() => onNavigate("settings")} className="h-10 px-5 border-white/10 hover:bg-white/5 cursor-pointer">
              Configure Keys
            </Button>
          </div>
        </div>
        <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-accent-foreground/10 blur-[80px] pointer-events-none" />
      </div>

      {/* Grid of Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#111111] border-white/5 hover:border-white/10 transition-colors shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">Scraped Leads</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-3xl md:text-4xl tabular-nums mt-3 font-semibold">{leads.length}</div>
            <p className="text-[11px] text-muted-foreground mt-2">Active in current session</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-white/5 hover:border-white/10 transition-colors shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">Audited Sites</span>
              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-3xl md:text-4xl tabular-nums mt-3 font-semibold">
              {auditedCount}
              <span className="text-muted-foreground/40 text-xl font-normal"> / {leads.length}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              {noSiteCount} lead{noSiteCount === 1 ? "" : "s"} with no website
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-white/5 hover:border-white/10 transition-colors shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">Avg PageSpeed</span>
              <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-3xl md:text-4xl tabular-nums mt-3 font-semibold">
              {avgSpeed ? `${avgSpeed}/100` : "—"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Optimizable mobile scores</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-white/5 hover:border-white/10 transition-colors shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">Potential Revenue</span>
              <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <IndianRupee className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-3xl md:text-4xl tabular-nums mt-3 font-semibold text-amber-400 flex items-baseline">
              <span className="text-2xl font-light mr-0.5">₹</span>
              {totalLost.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Est. missed revenue / month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Audits */}
        <Card className="md:col-span-2 bg-[#111111] border-white/5 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-medium">Recent Audits</CardTitle>
              <CardDescription className="text-xs">Most recent website performance scores</CardDescription>
            </div>
            <Button variant="ghost" onClick={() => onNavigate("audit")} className="h-8 text-xs hover:bg-white/5 cursor-pointer">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAudits.length > 0 ? (
              recentAudits.map(({ lead, audit }) => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-sm font-medium truncate">{lead.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{lead.category} · {lead.city}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Est. Lost</div>
                      <div className="text-sm font-mono font-medium text-amber-400">₹{audit.estLostRevenuePerMonth.toLocaleString("en-IN")}</div>
                    </div>
                    <div className={`h-9 w-9 rounded-lg font-mono text-sm font-semibold flex items-center justify-center ${
                      audit.pageSpeedScore >= 90 ? "bg-green-500/10 text-green-500" :
                      audit.pageSpeedScore >= 50 ? "bg-amber-500/10 text-amber-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      {audit.pageSpeedScore || "—"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/5 rounded-xl bg-white/[0.005]">
                <ShieldAlert className="h-8 w-8 text-muted-foreground/60 mb-2" />
                <p className="text-sm text-muted-foreground font-medium">No Audited Leads Yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">Run a lead scrape, then proceed to audit their web performance.</p>
                <Button size="sm" variant="outline" onClick={() => onNavigate("scrape")} className="mt-4 h-8 text-xs border-white/10 hover:bg-white/5 cursor-pointer">
                  Go to Scraper
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Workflow Logs */}
        <Card className="bg-[#111111] border-white/5 shadow-xl flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Session Logs</CardTitle>
            <CardDescription className="text-xs">Real-time actions in this session</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="flex gap-3 text-xs leading-normal">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0 animate-pulse" />
                    <div className="text-muted-foreground">
                      <span className="text-foreground font-medium">{log.split(" · ")[0]}</span>
                      {log.includes(" · ") && ` · ${log.split(" · ")[1]}`}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-muted-foreground italic">
                  No actions taken yet in this session. Start scraping or auditing to populate logs!
                </div>
              )}
            </div>
            
            {/* Quick Helper Panel */}
            <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => onNavigate("rank")} className="h-8 text-xs border-white/10 hover:bg-white/5 cursor-pointer">
                  Rank Leads
                </Button>
                <Button size="sm" variant="outline" onClick={() => selectedId ? onNavigate("build") : onNavigate("rank")} className="h-8 text-xs border-white/10 hover:bg-white/5 cursor-pointer">
                  Create Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
