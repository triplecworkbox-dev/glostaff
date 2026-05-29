import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/pricing", "/login", "/api/webhooks/stripe"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$)|)", "/", "/(api|trpc)(.*)"],
};
