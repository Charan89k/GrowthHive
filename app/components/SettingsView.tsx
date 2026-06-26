"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Key, Eye } from "lucide-react";

interface ApiStatus {
  apify: string;
  pagespeed: string;
  database: string;
  ai: string;
}

export function SettingsView({
  status,
  fetchStatus,
}: {
  status: ApiStatus | null;
  fetchStatus: () => void;
}) {
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl sm:text-4xl text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">System keys and environment status diagnostic metrics.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* API Statuses */}
        <Card className="bg-[#111111] border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> API & System Environment
            </CardTitle>
            <CardDescription className="text-xs">Connection diagnostic checks for current environment keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Apify Status */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Apify API</span>
                  <span className="text-xs text-muted-foreground">Google Maps lead scraping (Phase 1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${status?.apify === "Connected" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
                  <span className="text-xs font-semibold font-mono">
                    {status?.apify === "Connected" ? "Apify Connected" : "Missing Token"}
                  </span>
                </div>
              </div>

              {/* PageSpeed Status */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">PageSpeed API</span>
                  <span className="text-xs text-muted-foreground">Mobile website audits (Phase 2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${status?.pagespeed === "Connected" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
                  <span className="text-xs font-semibold font-mono">
                    {status?.pagespeed === "Connected" ? "PageSpeed Connected" : "Missing Key"}
                  </span>
                </div>
              </div>

              {/* Database Status */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Database Node</span>
                  <span className="text-xs text-muted-foreground">Session data storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold font-mono">In-Memory JSON Connected</span>
                </div>
              </div>

              {/* AI Status */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">AI Prompt Engine</span>
                  <span className="text-xs text-muted-foreground">Landing page prompt generator (Phase 4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold font-mono">Prompt Engine Active</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button onClick={fetchStatus} size="sm" variant="outline" className="h-9 text-xs border-white/10 hover:bg-white/5 cursor-pointer w-full">
                Refresh Diagnostics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keys Config Guide */}
      <Card className="bg-[#111111] border-white/5 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Key className="h-4 w-4 text-amber-500" /> Keys & Credentials Guide
            </CardTitle>
            <CardDescription className="text-xs">How to add credentials to enable live data</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => setShowKeys(!showKeys)} className="h-8 border-white/10 hover:bg-white/5 cursor-pointer">
            <Eye className="h-4 w-4 mr-1.5" /> {showKeys ? "Hide Details" : "Show Details"}
          </Button>
        </CardHeader>
        {showKeys && (
          <CardContent className="space-y-4 pt-2">
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                To enable live scraping and PageSpeed scores, create a file named <code className="text-foreground bg-white/5 px-1.5 py-0.5 rounded font-mono">.env.local</code> in the <code className="text-foreground bg-white/5 px-1.5 py-0.5 rounded font-mono">/app</code> directory and define the following variables:
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                  <div className="font-mono text-xs text-amber-400"># Apify Google Maps Crawler Token</div>
                  <div className="font-mono text-xs text-foreground mt-1">APIFY_TOKEN=apify_api_xxxxxxxxxxxxxxxxxxxxxxxx</div>
                  <div className="text-xs text-muted-foreground mt-1.5">Get a token for free from your Apify console (under Settings → API & Integrations).</div>
                </div>

                <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                  <div className="font-mono text-xs text-cyan-400"># Google PageSpeed API Key</div>
                  <div className="font-mono text-xs text-foreground mt-1">GOOGLE_PAGESPEED_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxx</div>
                  <div className="text-xs text-muted-foreground mt-1.5">Get a free key from developers.google.com/speed/docs/insights/v5/get-started.</div>
                </div>
              </div>

              <div className="flex gap-2 items-center text-xs text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>Restart the local development server after saving changes to load the environment files.</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
