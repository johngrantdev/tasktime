import { Link } from 'react-router-dom'
import { Button } from 'components/ui/button'
import { Login } from 'dialogs/login'

interface LaunchButtonProps {
  userLoggedIn: boolean
}

export function LaunchButton({ userLoggedIn }: LaunchButtonProps) {
  return (
    <>
      {userLoggedIn ? (
        <Button asChild variant={'outline'} size={'sm'}>
          <Link to="/app/projects">Launch</Link>
        </Button>
      ) : (
        <Login />
      )}
    </>
  )
}
