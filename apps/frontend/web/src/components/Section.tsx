interface SectionProps {
  children: React.ReactNode
}

const Section = ({ children }: SectionProps) => {
  return (
    <section className="grid items-center gap-6 px-8 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-start gap-2">{children}</div>
    </section>
  )
}

export default Section
