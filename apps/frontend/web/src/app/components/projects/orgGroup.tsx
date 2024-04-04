interface OrgGroupProps {
  children: React.ReactNode
  name: string
}

const OrgGroup = ({ name, children }: OrgGroupProps) => {
  return (
    <div className=" w-full rounded-md border bg-card p-4 text-card-foreground shadow">
      <div className="mb-4 flex flex-col space-y-1.5">{name}</div>
      <div className={'grid auto-cols-max grid-flow-col gap-4'}>{children}</div>
    </div>
  )
}

export default OrgGroup
