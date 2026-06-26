"use client";

import { useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardOverview } from "@/components/DashboardOverview";
import { AnalyticsView } from "@/components/AnalyticsView";
import { HistoryView } from "@/components/HistoryView";
import { SettingsView } from "@/components/SettingsView";
import { Phase1Scrape } from "@/components/Phase1Scrape";
import { Phase2Audit } from "@/components/Phase2Audit";
import { Phase3Rank } from "@/components/Phase3Rank";
import { Phase4Build } from "@/components/Phase4Build";
import { Phase5Outreach } from "@/components/Phase5Outreach";
import { scoreLead } from "@/lib/scoring";
import type { Lead, AuditResult } from "@/lib/types";
import { BRANDING } from "@/lib/branding";

interface ApiStatus {
  apify: string;
  pagespeed: string;
  database: string;
  ai: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read active view from URL parameter ?page=
  const currentTab = searchParams.get("page") || "dashboard";

  // App States (persisted during navigations)
  const [leads, setLeadsState] = useState<Lead[]>([]);
  const [audits, setAuditsState] = useState<Record<string, AuditResult>>({});
  const [selectedId, setSelectedIdState] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to fetch keys diagnostic status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error("Failed to check status", e);
    }
  }, []);

  // Fetch status on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStatus();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStatus]);

  // Log action helper
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs((prev) => [`${message} · ${timestamp}`, ...prev]);
  }, []);

  // Custom setters that auto-log real actions
  const setLeads = useCallback((newLeads: Lead[]) => {
    setLeadsState((prev) => {
      // If leads are populated from empty, log it
      if (newLeads.length > 0 && prev.length === 0) {
        const firstLead = newLeads[0];
        addLog(`Scraped ${newLeads.length} leads in ${firstLead.city}`);
      }
      return newLeads;
    });
  }, [addLog]);

  const setAudits = useCallback((newAudits: Record<string, AuditResult>) => {
    setAuditsState((prev) => {
      const prevKeys = Object.keys(prev);
      const newKeys = Object.keys(newAudits);
      
      // If a new audit has been added, log it
      if (newKeys.length > prevKeys.length) {
        const addedKey = newKeys.find(k => !prevKeys.includes(k));
        if (addedKey) {
          const lead = leads.find(l => l.id === addedKey);
          if (lead) {
            addLog(`Audited ${lead.name}`);
          }
        }
      }
      return newAudits;
    });
  }, [leads, addLog]);

  const setSelectedId = useCallback((id: string | null) => {
    setSelectedIdState(id);
    if (id) {
      const lead = leads.find(l => l.id === id);
      if (lead) {
        addLog(`Selected ${lead.name} for outreach campaign`);
      }
    }
  }, [leads, addLog]);

  // Navigate helper (updates Next.js search query)
  const handleNavigate = useCallback((tab: string) => {
    router.push(`?page=${tab}`);
  }, [router]);

  // Track completed steps for stepper progress
  const completed = useMemo(() => {
    const s = new Set<number>();
    if (leads.length > 0) s.add(1);
    if (Object.keys(audits).length > 0) s.add(2);
    if (selectedId) {
      s.add(3);
      s.add(4);
      s.add(5);
    }
    return s;
  }, [leads, audits, selectedId]);

  const selectedRanked = useMemo(() => {
    if (!selectedId) return null;
    const lead = leads.find((l) => l.id === selectedId);
    const audit = audits[selectedId];
    if (!lead || !audit) return null;
    return scoreLead(lead, audit);
  }, [selectedId, leads, audits]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Smart, Floating, Glassmorphic Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        completed={completed}
      />

      {/* Main Content Area */}
      <div className="flex-1 pl-[92px] md:pl-[276px] transition-all duration-300 flex flex-col min-h-screen">
        {/* Sticky blur Top Navigation with API indicators */}
        <TopBar
          onNavigate={handleNavigate}
          status={status}
          fetchStatus={fetchStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Content Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24">
          {currentTab === "dashboard" && (
            <DashboardOverview
              leads={leads}
              audits={audits}
              logs={logs}
              onNavigate={handleNavigate}
              selectedId={selectedId}
            />
          )}

          {currentTab === "scrape" && (
            <Phase1Scrape
              leads={leads}
              setLeads={setLeads}
              onNext={() => handleNavigate("audit")}
            />
          )}

          {currentTab === "audit" && (
            <Phase2Audit
              leads={leads}
              audits={audits}
              setAudits={setAudits}
              onNext={() => handleNavigate("rank")}
              onPrev={() => handleNavigate("scrape")}
            />
          )}

          {currentTab === "rank" && (
            <Phase3Rank
              leads={leads}
              audits={audits}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onNext={() => handleNavigate("build")}
              onPrev={() => handleNavigate("audit")}
            />
          )}

          {currentTab === "build" && (
            <Phase4Build
              selected={selectedRanked}
              onNext={() => {
                addLog(`Generated website prompt for ${selectedRanked?.name}`);
                handleNavigate("outreach");
              }}
              onPrev={() => handleNavigate("rank")}
            />
          )}

          {currentTab === "outreach" && (
            <Phase5Outreach
              selected={selectedRanked}
              onPrev={() => handleNavigate("build")}
            />
          )}

          {currentTab === "analytics" && (
            <AnalyticsView
              leads={leads}
              audits={audits}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === "history" && (
            <HistoryView
              leads={leads}
              audits={audits}
              onNavigate={handleNavigate}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
            />
          )}

          {currentTab === "settings" && (
            <SettingsView
              status={status}
              fetchStatus={fetchStatus}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-white/5 py-6 px-8 text-center text-xs text-muted-foreground/60">
          <div>
            © {new Date().getFullYear()} {BRANDING.appName} · {BRANDING.tagline}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading {BRANDING.appName}...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
