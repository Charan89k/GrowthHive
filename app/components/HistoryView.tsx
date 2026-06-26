"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Phone, Mail, CheckCircle, IndianRupee } from "lucide-react";
import type { Lead, AuditResult } from "@/lib/types";

export function HistoryView({
  leads,
  audits,
  onNavigate,
  setSelectedId,
  selectedId,
}: {
  leads: Lead[];
  audits: Record<string, AuditResult>;
  onNavigate: (tab: string) => void;
  setSelectedId: (id: string | null) => void;
  selectedId: string | null;
}) {
  const [search, setSearch] = useState("");

  const filteredLeads = useMemo(() => {
    return leads.filter((l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
    );
  }, [leads, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl sm:text-4xl text-foreground">Scanned Leads & Audits</h1>
          <p className="text-muted-foreground text-sm">Full list of business leads found in the current session with their audit state.</p>
        </div>
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads, niche, city..."
            className="pl-9 h-10 border-white/10 bg-white/[0.02] focus:bg-white/[0.04]"
          />
        </div>
      </div>

      <Card className="bg-[#111111] border-white/5 shadow-xl">
        <CardHeader>
          <CardTitle className="text-base font-medium">Historical Log ({filteredLeads.length})</CardTitle>
          <CardDescription className="text-xs">Contains all scraped results, audits, and pipeline selections.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="w-12 text-muted-foreground">#</TableHead>
                    <TableHead className="text-muted-foreground">Business</TableHead>
                    <TableHead className="text-muted-foreground">Niche & City</TableHead>
                    <TableHead className="text-muted-foreground">Contact</TableHead>
                    <TableHead className="text-muted-foreground">PageSpeed</TableHead>
                    <TableHead className="text-muted-foreground">Est. Loss / Mo</TableHead>
                    <TableHead className="text-right text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead, i) => {
                    const audit = audits[lead.id];
                    const isSelected = selectedId === lead.id;
                    return (
                      <TableRow key={lead.id} className="border-white/5 hover:bg-white/[0.02]">
                        <TableCell className="font-mono text-muted-foreground text-xs">{i + 1}</TableCell>
                        <TableCell className="font-medium text-foreground">
                          <div>{lead.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px] truncate">{lead.address}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold uppercase tracking-wider text-primary">{lead.category}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{lead.city}</div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="flex flex-col gap-1">
                            {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>}
                            {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>}
                            {!lead.phone && !lead.email && <span className="text-[10px] italic">No phone/email</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {audit ? (
                            audit.hasWebsite ? (
                              <div className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 rounded-full ${
                                  audit.pageSpeedScore >= 90 ? "bg-green-500" :
                                  audit.pageSpeedScore >= 50 ? "bg-amber-500" :
                                  "bg-red-500"
                                }`} />
                                <span className="font-mono font-medium text-xs text-foreground">{audit.pageSpeedScore}</span>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-[10px] font-normal text-red-400 border-red-500/20 bg-red-500/5">No Website</Badge>
                            )
                          ) : (
                            <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground border-white/5">Not Audited</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                          {audit ? (
                            <span className="flex items-center text-amber-400"><IndianRupee className="h-3 w-3 mr-0.5" />{audit.estLostRevenuePerMonth.toLocaleString("en-IN")}</span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {audit ? (
                              <Button
                                size="xs"
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => {
                                  setSelectedId(lead.id);
                                  onNavigate("rank");
                                }}
                                className="cursor-pointer"
                              >
                                {isSelected ? (
                                  <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Selected</span>
                                ) : (
                                  "Select"
                                )}
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => {
                                  onNavigate("audit");
                                }}
                                className="cursor-pointer border-white/10 hover:bg-white/5"
                              >
                                Audit
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No leads match your search query. Run a new scrape or adjust your search filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
