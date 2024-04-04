import Docs from '@/pages/docs'
import Features from '@/pages/features'
import NotFound from '@/pages/notFound'
import { Home } from 'lucide-react'
import { Suspense } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'

const publicRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route
        path="/*"
        element={<NotFound />}
        handle={{ title: 'Not Found', mainNav: false }}
      />
      <Route
        index
        element={<Home />}
        handle={{ title: 'Home', mainNav: false }}
      />
      <Route
        path="/features"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Features />
          </Suspense>
        }
        handle={{ title: 'Features', mainNav: true }}
      />
      <Route
        path="/docs"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Docs />
          </Suspense>
        }
        handle={{ title: 'Documentation', mainNav: true }}
      />
    </Route>
  )
)

const Public = () => {
  return <RouterProvider router={publicRouter} />
}

export default Public
