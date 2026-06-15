import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Only run Supabase session refresh + route guards when configured.
  // This keeps the design preview working before the database is connected.
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const { updateSession } = await import("@/lib/supabase/middleware");
    return updateSession(request);
  }
  return NextResponse.next();
}

export const config = {
  // Run on everything except static assets and image optimisation.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
