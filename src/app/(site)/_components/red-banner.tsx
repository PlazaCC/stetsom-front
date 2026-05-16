'use client'

import Marquee from 'react-fast-marquee'

interface RedBannerProps {
  milestones: string[]
}

export function RedBanner({ milestones }: Readonly<RedBannerProps>) {
  return (
    <section className='bg-bar-accent py-4 overflow-hidden'>
      <Marquee gradient={false} speed={40}>
        <div className='flex items-center gap-9'>
          {milestones.map((milestone, i) => (
            <div key={milestone} className='flex items-center gap-9 shrink-0'>
              <span className='text-white font-sans-condensed font-normal text-lg tracking-[0.05em] uppercase whitespace-nowrap'>
                {milestone}
              </span>
              {i < milestones.length - 1 && <div className='w-2 h-2 rounded-full bg-white shrink-0' />}
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  )
}
