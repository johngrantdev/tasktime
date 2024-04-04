import { Button } from 'components/ui/button'
import { Link } from 'react-router-dom'

interface OrgGroupProps {
  name: string
  href?: string
  linkName?: string
  onClick: () => void
}

const Tile = ({ name, href, linkName, onClick }: OrgGroupProps) => {
  return (
    <div
      className={
        'flex h-36 w-36 select-none flex-col gap-3 overflow-hidden rounded-md border bg-transparent text-card-foreground shadow'
      }
    >
      <div className={'m-auto'}>{name}</div>
      {href ? (
        <Button
          asChild
          className={'rounded-none border-none bg-muted'}
          variant={'outline'}
          size={'sm'}
        >
          <Link onClick={() => onClick()} to={href}>
            {linkName}
          </Link>
        </Button>
      ) : (
        ''
      )}
    </div>
  )
}

export default Tile
