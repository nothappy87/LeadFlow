import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/categories(.*)",
  "/api/stats(.*)",
]);

const isIgnoredRoute = createRouteMatcher([
  "/_next(.*)",
  "/favicon.ico",
  "/api/leads/generate(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isIgnoredRoute(req)) {
    return;
  }

  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
