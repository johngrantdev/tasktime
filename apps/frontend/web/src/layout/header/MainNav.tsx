import { NavLink } from 'react-router-dom'
import { publicRoutes } from 'routes/publicRoutes'

interface INavItem {
  path: string
  handle: {
    title: string
    mainNav: boolean
  }
}

export function MainNav() {
  const mainNav: INavItem[] = publicRoutes
    .filter(
      (route) =>
        route.path && route.handle && route.handle.title && route.handle.mainNav
    )
    .map((route) => ({
      path: route.path,
      handle: route.handle
    })) as INavItem[]

  const handleProject = (navItem: INavItem, index: number) => {
    return (
      <nav
        key={index}
        className={
          'flex cursor-pointer items-center text-sm font-medium text-muted-foreground '
        }
      >
        <NavLink
          key={index}
          to={navItem.path}
          className={({ isActive }) =>
            isActive
              ? 'text-foreground transition-colors duration-300 hover:text-accent-foreground'
              : 'transition-colors duration-300 hover:text-accent-foreground'
          }
        >
          {navItem.handle.title}
        </NavLink>
      </nav>
    )
  }

  return (
    <div className="mx-4 flex gap-6 md:gap-10">
      <nav className="flex gap-6">
        {mainNav.map((navItem, index) => handleProject(navItem, index))}
      </nav>
    </div>
  )
}
