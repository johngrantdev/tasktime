import { useEffect } from 'react'
import AvatarDropDown from './header/AvatarDropDown'
import { LaunchButton } from './header/LaunchButton'
import { MainNav } from './header/MainNav'
import { Title } from './header/Title'
import { Outlet, useMatches, useNavigate } from 'react-router-dom'

type IHandle = {
  title: string
  protectedRoute: boolean
  mainNav: boolean
  appNav: boolean
}

type LayoutProps = {
  userLoggedIn: boolean
  setUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  redirect: string
}

export const Layout = ({
  userLoggedIn,
  setUserLoggedIn,
  redirect
}: LayoutProps) => {
  // extract page title from the current routes object.
  const matches = useMatches()
  let pageTitle = ''
  let protectedRoute = false
  // const mainNav = false
  // The last match in the array is the deepest matching route; the current route
  const currentMatch = matches[matches.length - 1]
  if (currentMatch.handle) {
    const handle = currentMatch?.handle as IHandle
    if (handle.title) {
      pageTitle = handle.title
    }
    if (handle.protectedRoute) {
      protectedRoute = handle.protectedRoute
    }
    // if (handle.mainNav) {
    //   mainNav = handle.mainNav
    // }
  }

  const navigate = useNavigate()
  useEffect(() => {
    if (redirect !== '') {
      navigate(redirect)
    }
  }, [navigate, redirect])

  return (
    <div className="min-h-screen w-full bg-background font-sans antialiased transition-colors duration-500">
      <header className="sticky top-0 z-40 w-screen bg-background transition-colors duration-500">
        <div className="flex h-16 items-center space-x-4 px-8 sm:justify-between sm:space-x-0">
          <Title pageTitle={pageTitle} />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <MainNav />
            {!protectedRoute || !userLoggedIn ? (
              <LaunchButton userLoggedIn={userLoggedIn} />
            ) : null}
            {userLoggedIn ? (
              <AvatarDropDown
                setUserLoggedIn={setUserLoggedIn}
                firstName={'John'}
                lastName={'Grant'}
              />
            ) : null}
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
