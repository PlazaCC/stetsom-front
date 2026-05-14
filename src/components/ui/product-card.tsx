import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  name: string
  category: string
  spec?: string | null
  badge?: string | null
  img?: string
  href?: string
}

export default function ProductCard({ name, category, spec, badge, img, href = '/produtos' }: ProductCardProps) {
  return (
    <Link
      href={href}
      className='group flex flex-col bg-white border border-zinc-200 hover:border-brand hover:shadow-md rounded-lg overflow-hidden transition-all'>
      <div className='bg-card h-32 md:h-36 lg:h-40 flex items-center justify-center p-4'>
        {img ? (
          <Image src={img} alt={name} width={160} height={130} className='object-contain max-h-32.5' />
        ) : (
          <div className='w-24 h-20 bg-zinc-200 rounded' />
        )}
      </div>
      <div className='p-3'>
        <div className='font-sans-condensed font-medium text-2xs uppercase text-brand mb-1'>{category}</div>
        <div className='font-sans-condensed font-bold text-base uppercase text-brand-dark leading-tight'>{name}</div>
        {spec && <div className='text-xs text-zinc-400 mt-1.5'>{spec}</div>}
      </div>
      <div className='border-t border-zinc-100 px-3.5 py-2 flex justify-between items-center gap-2 mt-auto'>
        {badge && (
          <span className='bg-brand text-white font-sans-condensed font-bold text-2xs uppercase px-2.5 py-1'>
            {badge}
          </span>
        )}
        <span className='font-sans-condensed text-button-md text-brand font-semibold flex-shrink-0'>Ver mais ›</span>
      </div>
    </Link>
  )
}
