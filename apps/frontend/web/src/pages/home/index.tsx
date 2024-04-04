import { buttonVariants } from 'components/ui/button'
import { Link } from 'react-router-dom'
import { siteConfig } from '../../../config/site'

const Home = () => {
  return (
    <>
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="font-sans text-3xl leading-tight tracking-tighter md:text-4xl">
          A tool to capture the state of a project.
        </h1>
        <p className=" max-w-[700px] text-lg">
          {/* text-muted-foreground */}
          Nested tasks .
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          target="_blank"
          rel="noreferrer"
          to={siteConfig.links.github}
          className={buttonVariants({ variant: 'outline' })}
        >
          GitHub
        </Link>
      </div>
    </>
  )
}

export default Home
