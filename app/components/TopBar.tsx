"use client";

import { Search, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onNavigate: (tab: string) => void;
  status: {
    apify: string;
    pagespeed: string;
    database: string;
    ai: string;
  } | null;
  fetchStatus: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TopBar({ onNavigate, status, fetchStatus, searchQuery, setSearchQuery }: TopBarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function handleRefresh() {
    setIsRefreshing(true);
    await fetchStatus();
    setTimeout(() => setIsRefreshing(false), 600);
  }

  return (
    <header className="sticky top-0 z-30 flex flex-col border-b border-white/5 bg-background/80 backdrop-blur-md">
      {/* Top Status Bar Indicator (saves debugging time!) */}
      <div className="bg-black/40 border-b border-white/5 px-6 py-2 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
          {/* Apify Status */}
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-muted-foreground font-medium">Apify:</span>
            {status?.apify === "Connected" ? (
              <span className="flex items-center gap-1 font-mono text-[11px] text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 font-mono text-[11px] text-amber-500">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Token Missing
              </span>
            )}
          </div>

          {/* PageSpeed Status */}
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-muted-foreground font-medium">PageSpeed:</span>
            {status?.pagespeed === "Connected" ? (
              <span className="flex items-center gap-1 font-mono text-[11px] text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 font-mono text-[11px] text-amber-500">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Key Missing
              </span>
            )}
          </div>

          {/* Database Status */}
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-muted-foreground font-medium">Database:</span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Local JSON
            </span>
          </div>

          {/* AI Engines */}
          <div className="flex items-center gap-1.5 select-none">
            <span className="text-muted-foreground font-medium">AI:</span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
            </span>
          </div>
        </div>

        <button 
          onClick={handleRefresh}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 px-1 rounded hover:bg-white/5 cursor-pointer"
        >
          <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
          <span>Sync Status</span>
        </button>
      </div>

      {/* Main Top Bar Actions */}
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Global Search Business leads */}
        <div className="relative max-w-sm w-full flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Navigate to history tab so they can see results in real-time
              onNavigate("history");
            }}
            placeholder="Search active business leads..."
            className="pl-9 h-9 border-white/5 bg-white/[0.02] focus:bg-white/[0.04] text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => onNavigate("scrape")}
            className="h-9 px-4 gap-1.5 cursor-pointer bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/20 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> New Scrape
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate("settings")}
            className="h-9 px-3 border-white/10 hover:bg-white/5 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
          >
            Config keys
          </Button>
        </div>
      </div>
    </header>
  );
}
