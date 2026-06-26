import { NextResponse } from "next/server";

export async function GET() {
  const apify = !!process.env.APIFY_TOKEN;
  const pagespeed = !!process.env.GOOGLE_PAGESPEED_KEY;
  
  return NextResponse.json({
    apify: apify ? "Connected" : "Missing Token",
    pagespeed: pagespeed ? "Connected" : "Missing Key",
    database: "Local JSON (leads-seed.json)",
    ai: "Local Templates Active",
  });
}
