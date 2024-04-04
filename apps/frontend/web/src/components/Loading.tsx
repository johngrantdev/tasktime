import { Progress } from 'components/ui/progress'

const Loading = () => {
  return (
    <div className={'flex min-h-full min-w-full items-center justify-center'}>
      <Progress value={1000} />
    </div>
  )
}

export default Loading
