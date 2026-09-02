import { Suspense, useEffect, useState } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { authLoginToken } from 'services/authLoginToken';
import { Layout } from 'layout';
import NotFound from './pages/notFound';
import Home from './pages/home';
import Features from './pages/features';
import Docs from './pages/docs';
import { loginCheck } from './services/loginCheck';
import { toast } from './components/ui/use-toast';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [routesReady, setRoutesReady] = useState(false);
  const [redirect, setRedirect] = useState('');

  // Pageload effects
  // 1. handles presence of login token in url path ie. a login link
  //    a. authenticates token
  //    b. stores
  // 2. handles verifying user is logged in
  useEffect(() => {
    const fetchData = async () => {
      // first check for jwt param
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        const response = await authLoginToken(token);
        console.log(response);
        if (response.auth) {
          setUserLoggedIn(true);
          setRedirect('/app');
        } else {
          setRedirect('/');
        }
        toast({
          title: response.title,
          description: response.description,
        });
      } else {
        setUserLoggedIn(await loginCheck());
      }
      setRoutesReady(true);
    };
    fetchData();
  }, []);

  if (!routesReady) return null;

  const mainRoutes = (
    <Route
      path="/"
      element={
        <Layout
          userLoggedIn={userLoggedIn}
          setUserLoggedIn={setUserLoggedIn}
          redirect={redirect}
        />
      }
    >
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
  );

  const router = createBrowserRouter(createRoutesFromElements(mainRoutes));

  return <RouterProvider router={router} />;
}

export default App;
