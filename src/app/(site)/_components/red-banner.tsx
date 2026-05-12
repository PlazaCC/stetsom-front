'use client'

import Marquee from 'react-fast-marquee'

interface RedBannerProps {
  milestones: string[]
}

export default function RedBanner({ milestones }: Readonly<RedBannerProps>) {
  return (
    <section className='bg-brand py-4 overflow-hidden'>
      <Marquee gradient={false} speed={40}>
        <div className='flex items-center gap-6 pr-6'>
          {milestones.map((milestone, i) => (
            <div key={i} className='flex items-center gap-6 shrink-0'>
              <span className='text-white font-sans-condensed font-medium text-lg uppercase whitespace-nowrap'>
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
