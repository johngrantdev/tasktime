import { Login } from 'dialogs/login'

const Features = () => {
  return (
    <div className="flex max-w-[980px] flex-col items-start gap-2">
      <h1 className="font-sans text-3xl leading-tight tracking-tighter md:text-4xl">
        Features.
      </h1>
      <p className=" max-w-[700px] text-lg">
        {/* text-muted-foreground */}
        Todo
      </p>
      <Login />
    </div>
  )
}

export default Features
