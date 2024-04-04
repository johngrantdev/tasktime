import { siteConfig } from '../../../config/site'
import { animated, useSpring } from '@react-spring/web'

interface TitleProps {
  pageTitle: string
}

export function Title({ pageTitle }: TitleProps) {
  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    reset: true, // resets the animation each time
    config: { tension: 280, friction: 60 } // adjust for desired effect
  })

  return (
    <>
      <span className="inline-block select-none pr-2 text-3xl">
        {siteConfig.name}
      </span>
      {pageTitle !== 'Home' ? (
        <span className="inline-block select-none pr-2 text-3xl"> | </span>
      ) : (
        ''
      )}
      <animated.span style={fade} className="inline-block select-none text-3xl">
        {pageTitle !== 'Home' ? pageTitle.toLowerCase() : ''}
      </animated.span>
    </>
  )
}
