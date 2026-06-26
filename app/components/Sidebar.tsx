"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileSearch,
  Trophy,
  Sparkles,
  Send,
  LayoutDashboard,
  BarChart,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRANDING } from "@/lib/branding";

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  completed: Set<number>;
}

export function Sidebar({ currentTab, onNavigate, completed }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      section: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      section: "Pipeline",
      items: [
        { id: "scrape", label: "Scrape Leads", icon: Search, phaseId: 1 },
        { id: "audit", label: "Website Audit", icon: FileSearch, phaseId: 2 },
        { id: "rank", label: "Lead Ranking", icon: Trophy, phaseId: 3 },
        { id: "build", label: "Website Prompt", icon: Sparkles, phaseId: 4 },
        { id: "outreach", label: "Outreach", icon: Send, phaseId: 5 },
      ],
    },
    {
      section: "Insights",
      items: [
        { id: "analytics", label: "Analytics", icon: BarChart },
        { id: "history", label: "History", icon: History },
      ],
    },
    {
      section: "System",
      items: [
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 left-0 z-40 my-4 ml-4 rounded-[24px] border border-white/5 bg-black/60 backdrop-blur-xl shadow-2xl flex flex-col justify-between overflow-hidden"
    >
      <div className="flex flex-col flex-1">
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 shrink-0">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2.5"
              >
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <div className="font-display font-semibold text-lg text-foreground tracking-tight">
                  {BRANDING.appName}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto"
              >
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-white/5">
          {menuItems.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.2em] px-3 mb-1.5 select-none">
                  {section.section}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = currentTab === item.id;
                  const Icon = item.icon;
                  
                  // Check status for workflow items
                  const isWorkflowItem = "phaseId" in item;
                  const phaseId = isWorkflowItem ? (item as { phaseId: number }).phaseId : undefined;
                  const isDone = isWorkflowItem && typeof phaseId === "number" && completed.has(phaseId);
                  const isNextStep = isWorkflowItem && typeof phaseId === "number" && !isDone && (phaseId === 1 || completed.has(phaseId - 1));

                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer",
                        isActive
                          ? "bg-white/[0.06] text-foreground shadow-md border-l-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}

                      {/* Workflow indicators (Checkmark or dot) */}
                      {isWorkflowItem && !isCollapsed && (
                        <div className="ml-auto shrink-0 flex items-center">
                          {isDone ? (
                            <CheckCircle className="h-3.5 w-3.5 text-green-500 fill-green-500/10" />
                          ) : isNextStep ? (
                            <Circle className="h-3 w-3 text-cyan-400 fill-cyan-400/20" />
                          ) : (
                            <Circle className="h-3 w-3 text-muted-foreground/20" />
                          )}
                        </div>
                      )}

                      {isCollapsed && isWorkflowItem && isDone && (
                        <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-green-500" />
                      )}
                      {isCollapsed && isWorkflowItem && isNextStep && (
                        <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Toggle for collapsed mode */}
      {isCollapsed && (
        <div className="p-3 border-t border-white/5 text-center shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="mx-auto text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.aside>
  );
}
