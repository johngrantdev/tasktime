import React, { Suspense } from 'react'
import Home from 'pages/home'
import NotFound from 'pages/notFound'
import { IRoute } from 'intefaces/route.interface'
// lazy loaded imports
const Features = React.lazy(() => import('pages/features'))
const Docs = React.lazy(() => import('pages/docs'))

export const publicRoutes: IRoute[] = [
  {
    path: '/*',
    element: <NotFound />,
    handle: {
      title: 'Not Found',
      mainNav: false
    }
  },
  {
    index: true,
    element: <Home />,
    handle: {
      title: 'Home',
      mainNav: false
    }
  },
  {
    path: '/features',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Features />
      </Suspense>
    ),
    handle: {
      title: 'Features',
      mainNav: true
    }
  },
  {
    path: '/docs',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Docs />
      </Suspense>
    ),
    handle: {
      title: 'Documentation',
      mainNav: true
    }
  }
]
