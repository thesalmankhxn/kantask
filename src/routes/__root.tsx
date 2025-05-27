import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { AppContextProvider } from '~/state/app-state'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

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
