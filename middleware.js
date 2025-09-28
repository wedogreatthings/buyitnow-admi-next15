import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Configuration
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Rate limiting simple (pour Vercel gratuit)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100; // 100 requêtes par minute

// Fonction de rate limiting basique
function checkRateLimit(identifier) {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier) || [];

  // Nettoyer les anciennes requêtes
  const recentRequests = userRequests.filter(
    (time) => now - time < RATE_LIMIT_WINDOW,
  );

  if (recentRequests.length >= MAX_REQUESTS) {
    return false; // Rate limit dépassé
  }

  recentRequests.push(now);
  requestCounts.set(identifier, recentRequests);

  // Nettoyer la map périodiquement
  if (requestCounts.size > 1000) {
    requestCounts.clear();
  }

  return true;
}

export default withAuth(
  async function middleware(req) {
    const { pathname, origin } = req.nextUrl;
    const userRole = req?.nextauth?.token?.user?.role;
    const userEmail = req?.nextauth?.token?.user?.email;
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

    // Rate limiting pour les APIs
    if (pathname.startsWith('/api/')) {
      const identifier = userEmail || ip;

      if (!checkRateLimit(identifier)) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: 'Too many requests. Please try again later.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': MAX_REQUESTS.toString(),
              'X-RateLimit-Window': (RATE_LIMIT_WINDOW / 1000).toString(),
            },
          },
        );
      }
    }

    // Headers de sécurité pour les réponses
    const response = NextResponse.next();

    // CORS restrictif pour les APIs
    if (pathname.startsWith('/api/')) {
      // Seules les requêtes du même domaine sont autorisées
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );

      // Headers de sécurité supplémentaires
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '0');
      response.headers.set(
        'Referrer-Policy',
        'strict-origin-when-cross-origin',
      );
    }

    // Protection des routes admin - seuls les admins y ont accès
    if (pathname.startsWith('/admin')) {
      if (userRole !== 'admin') {
        // Log de tentative d'accès non autorisé
        if (IS_PRODUCTION) {
          console.warn(
            `[SECURITY] Unauthorized admin access attempt by ${userEmail || ip} to ${pathname}`,
          );
        }

        // Redirection avec message d'erreur
        const loginUrl = new URL('/', req.url);
        loginUrl.searchParams.set('error', 'unauthorized');
        loginUrl.searchParams.set('callbackUrl', pathname);

        return NextResponse.redirect(loginUrl);
      }

      // Ajouter des headers pour les admins authentifiés
      response.headers.set('X-Admin-User', userEmail || 'unknown');
      response.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate',
      );
    }

    // Protection CSRF basique pour les mutations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const contentType = req.headers.get('content-type');

      // Vérifier que c'est une requête légitime
      if (
        !contentType ||
        (!contentType.includes('application/json') &&
          !contentType.includes('multipart/form-data'))
      ) {
        if (!pathname.includes('/api/auth/')) {
          // Exclure les endpoints d'auth
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: 'Invalid content type',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            },
          );
        }
      }
    }

    // Protection contre les scans de sécurité
    const suspiciousPaths = [
      '/.env',
      '/wp-admin',
      '/phpMyAdmin',
      '/.git',
      '/config',
      '/backup',
      '/.aws',
      '/admin.php',
      '/login.php',
      '/shell.php',
    ];

    if (suspiciousPaths.some((path) => pathname.includes(path))) {
      console.warn(
        `[SECURITY] Suspicious path access attempt: ${pathname} from ${ip}`,
      );
      return new NextResponse(null, { status: 404 });
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Pages publiques (login)
        if (pathname === '/') {
          return true;
        }

        // Toutes les autres routes nécessitent une authentification
        if (!token) {
          return false;
        }

        // Routes admin nécessitent le rôle admin
        if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
          return token?.user?.role === 'admin';
        }

        return true;
      },
    },
    pages: {
      signIn: '/',
      error: '/',
    },
  },
);

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico, robots.txt, sitemap.xml
     * - images publiques
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/).*)',
    '/admin/:path*',
    '/api/:path*',
  ],
};
