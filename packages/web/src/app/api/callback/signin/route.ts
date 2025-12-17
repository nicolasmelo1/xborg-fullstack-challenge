import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const url = new URL("/signin/callback", request.url);
  const error = request.nextUrl.searchParams.get("error");
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

