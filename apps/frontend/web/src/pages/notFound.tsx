import { Button } from 'components/ui/button'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex max-w-[980px] flex-col items-start gap-6">
      <p className="text-md md:text-md font-sans leading-tight tracking-tighter">
        There is no page at this address.
      </p>
      <Button asChild variant={'outline'} size={'sm'}>
        <Link to={`/`}>Return to homepage</Link>
      </Button>
    </div>
  )
}

export default NotFound
