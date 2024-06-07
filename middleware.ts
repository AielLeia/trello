import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { route } from '@/lib/route';

export default authMiddleware({
  publicRoutes: ['/', '/api/webhook'],
  afterAuth(auth, req) {
    console.log({ auth, req });
    if (auth.userId && auth.isPublicRoute) {
      console.log({
        'auth.userId && auth.isPublicRoute': auth.userId && auth.isPublicRoute,
      });
      let path = '/select-org';
      if (auth.orgId) {
        path = route('/organization/[organizationId]', {
          params: { organizationId: auth.orgId },
        });
      }

      const orgSelection = new URL(path, req.url);
      return NextResponse.redirect(orgSelection);
    }

    if (!auth.userId && !auth.isPublicRoute) {
      console.log({
        '!auth.userId && !auth.isPublicRoute':
          !auth.userId && !auth.isPublicRoute,
      });
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== '/select-org') {
      console.log({
        "auth.userId && !auth.orgId && req.nextUrl.pathname !== '/select-org'":
          auth.userId && !auth.orgId && req.nextUrl.pathname !== '/select-org',
      });
      const orgSelection = new URL('/select-org', req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: ['/((?!.+.[w]+$|_next|logo).*)', '/', '/(api|trpc)(.*)'],
};
