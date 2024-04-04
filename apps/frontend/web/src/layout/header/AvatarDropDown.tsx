import { siteConfig } from '../../../config/site'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from 'components/ui/dropdown-menu'
import { logout } from '@/services/logout'
import { useTheme } from '@/components/theme-provider'
import ProfileDialog from '@/dialogs/profile'
import { useEffect, useRef, useState } from 'react'
import React from 'react'

interface AvatarDropDownProps {
  firstName: string
  lastName: string
  setUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  avatarImg?: string
}

const nameToInitials = (firstName: string, lastName: string) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return firstInitial + lastInitial
}

const AvatarDropDown = ({
  firstName,
  lastName,
  setUserLoggedIn,
  avatarImg = ''
}: AvatarDropDownProps) => {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  // State definitions
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  // trigger profile open is used to undertake required steps before
  // the profile can be opened.
  const [triggerProfileOpen, setTriggerProfileOpen] = useState(false)
  // trigger profile closed is used to undertake required steps before
  // the dropdown can be opened and focus brought back to the profile menu item.
  const [triggerProfileClosed, setTriggerProfileClosed] = useState(false)

  const dropdownProfileRef = useRef<HTMLDivElement>(null)

  // Function to handle user logout
  const navigate = useNavigate()
  const logOut = () => {
    logout()
    setUserLoggedIn(false)
    navigate('/')
  }

  // Effect to manage the opening and closing of modals
  // specificly the dropdown and profile dialog modals
  useEffect(() => {
    // Profile open effects
    // 1. dropdown state is set to close when clicked
    // 2. once the dropdown is closed, only then open profile dialog
    if (!dropdownOpen && triggerProfileOpen) {
      setProfileOpen(true)
      setTriggerProfileOpen(false)
    }
    // Profile close effects
    // 1. once triggerProfileClosed is set -> set profile open to false
    if (profileOpen && triggerProfileClosed) {
      setProfileOpen(false)
    }
    // 2. Once profile dialog is closed open dropdown
    if (!profileOpen && triggerProfileClosed) {
      setDropdownOpen(true)
    }
    // 3. Then once dropdown is open, focus back to profile item
    if (dropdownOpen && triggerProfileClosed) {
      dropdownProfileRef.current?.focus()
      setTriggerProfileClosed(false)
    }
  }, [triggerProfileOpen, dropdownOpen, profileOpen, triggerProfileClosed])

  return (
    <>
      <DropdownMenu
        modal={dropdownOpen}
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
      >
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={avatarImg} />
            <AvatarFallback>
              {nameToInitials(firstName, lastName)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-6">
          <DropdownMenuItem
            ref={dropdownProfileRef}
            onSelect={() => setTriggerProfileOpen(true)}
            className=" h-full w-full cursor-pointer"
          > 
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild={true}>
            <div className="h-full w-full cursor-pointer" onClick={toggleTheme}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem asChild={true}>
            <Link
              to={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="h-full w-full cursor-pointer"
            >
              Source
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild={true}>
            <Link to="/docs" className="h-full w-full cursor-pointer">
              Documentation
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild={true}>
            <Link
              to="/"
              onClick={() => logOut()}
              className="h-full w-full cursor-pointer"
            >
              Log out
              {/* <span className="sr-only">Log out</span> */}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileDialog
        modal={profileOpen}
        open={profileOpen}
        onOpenChange={() => setTriggerProfileClosed(true)}
      />
    </>
  )
}

export default AvatarDropDown
