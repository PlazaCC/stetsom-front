interface RedBannerProps {
  milestones: string[]
}

export default function RedBanner({ milestones }: Readonly<RedBannerProps>) {
  const repeatedMilestones = Array(4)
    .fill(null)
    .flatMap(() => milestones)

  return (
    <section className='bg-brand py-4 overflow-hidden'>
      <div className='w-full'>
        <div className='flex items-center gap-6'>
          {repeatedMilestones.map((milestone, i) => (
            <div key={i} className='flex items-center gap-6 shrink-0'>
              <span className='text-white font-sans-condensed font-medium text-lg uppercase whitespace-nowrap'>
                {milestone}
              </span>
              {i < repeatedMilestones.length - 1 && <div className='w-2 h-2 rounded-full bg-white shrink-0' />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
