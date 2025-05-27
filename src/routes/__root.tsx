import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { ClerkProvider, useAuth, useUser } from '@clerk/tanstack-react-start'
import { AppContextProvider } from '~/state/app-state'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'
import { useServerFn } from '@tanstack/react-start'
import { handleAuthCallback } from '~/api/auth-callback'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  // errorComponent: (props) => {
  //   return (
  //     <RootDocument>
  //       <DefaultCatchBoundary {...props} />
  //     </RootDocument>
  //   )
  // },
  // notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function AuthHandler() {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const callAuthCallback = useServerFn(handleAuthCallback);

  React.useEffect(() => {
    const performAuthCallback = async () => {
      if (isAuthLoaded && isUserLoaded && isSignedIn && user) {
        const existingToken = localStorage.getItem('auth-token');
        if (!existingToken) {
          setIsLoading(true);
          setError(null);
          try {
            console.log('Calling handleAuthCallback for user:', user.id);
            const result = await callAuthCallback();
            if (result.jwt) {
              localStorage.setItem('auth-token', result.jwt);
              console.log('JWT stored in localStorage.');
            } else {
              throw new Error('JWT not received from auth callback.');
            }
          } catch (e: any) {
            console.error('Error during auth callback:', e);
            setError(e.message || 'Failed to complete authentication setup.');
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    performAuthCallback();
  }, [isSignedIn, isAuthLoaded, user, isUserLoaded, callAuthCallback]);

  if (isLoading) {
    return <div>Finalizing authentication...</div>;
  }

  if (error) {
    return <div>Error setting up session: {error} <button onClick={() => { localStorage.removeItem('auth-token'); window.location.reload(); }}>Retry</button></div>;
  }

  return null;
}

function RootComponent() {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const signInUrl = import.meta.env.VITE_CLERK_SIGN_IN_URL;
  const signUpUrl = import.meta.env.VITE_CLERK_SIGN_UP_URL;
  const afterSignInUrl = import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL;
  const afterSignUpUrl = import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL;

  if (!publishableKey) {
    throw new Error("Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file.")
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={afterSignInUrl}
      afterSignUpUrl={afterSignUpUrl}
    >
      <AppContextProvider>
        <RootDocument>
          <AuthHandler />
          <Outlet />
        </RootDocument>
      </AppContextProvider>
    </ClerkProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
