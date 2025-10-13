import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerInstance } from '../db/supabase.client';

// Public paths - Auth API endpoints & Server-Rendered Astro Pages
const PUBLIC_PATHS = [
  // Public Pages
  "/",
  "/index",
  // Server-Rendered Auth Pages
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  // Auth API endpoints
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
  "/api/auth/logout"
];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, request, redirect }, next) => {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // For public paths, we still want to check auth state but not enforce it
    if (PUBLIC_PATHS.includes(url.pathname)) {
      locals.supabase = supabase;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        locals.user = {
          email: user.email || null,
          id: user.id,
        };
      }
      return next();
    }

    // IMPORTANT: Always get user session first before any other operations
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      locals.user = {
        email: user.email || null,
        id: user.id,
      };
      locals.supabase = supabase;
    } else if (!PUBLIC_PATHS.includes(url.pathname)) {
      // Redirect to login for protected routes
      return redirect('/auth/login');
    }

    return next();
  },
);
