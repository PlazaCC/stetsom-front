import { FOOTER_COLUMNS } from '@/lib/mock/navigation'
import Image from 'next/image'
import Link from 'next/link'

const SOCIALS = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898v-2.887h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.773-1.63 1.562v1.875h2.773l-.443 2.887h-2.33v6.99C18.343 21.128 22 16.991 22 12z'
          fill='currentColor'
        />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='3' y='3' width='18' height='18' rx='5' stroke='currentColor' strokeWidth='2' />
        <circle cx='12' cy='12' r='4' stroke='currentColor' strokeWidth='2' />
        <circle cx='17.5' cy='6.5' r='1.25' fill='currentColor' />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M23.498 6.186a2.996 2.996 0 0 0-2.11-2.12C19.66 3.5 12 3.5 12 3.5s-7.66 0-9.387.565a2.997 2.997 0 0 0-2.11 2.12A31.28 31.28 0 0 0 0 12a31.28 31.28 0 0 0 .503 5.814 2.996 2.996 0 0 0 2.11 2.12C4.34 20.5 12 20.5 12 20.5s7.66 0 9.387-.565a2.996 2.996 0 0 0 2.11-2.12A31.28 31.28 0 0 0 24 12a31.28 31.28 0 0 0-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z'
          fill='currentColor'
        />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M16 3h2.5a4.5 4.5 0 0 1 0 9H16v6.5A4.5 4.5 0 0 1 11.5 23 4.5 4.5 0 0 1 7 18.5V9h2v9.5A2.5 2.5 0 0 0 11.5 21 2.5 2.5 0 0 0 14 18.5V12h4.5a2.5 2.5 0 0 0 0-5H16V3z'
          fill='currentColor'
        />
      </svg>
    ),
  },
]

const COPYRIGHT_LINKS = [
  { label: 'Política de privacidade', href: '#' },
  { label: 'Termos de uso', href: '#' },
  { label: 'Cookies', href: '#' },
]

export default function Footer() {
  return (
    <footer className='bg-footer'>
      <div className='mx-auto flex w-full max-w-360 flex-col gap-9 px-5 py-6 lg:px-42.5'>
        <div className='flex flex-col gap-9 lg:flex-row lg:flex-wrap lg:gap-x-41 lg:gap-y-9'>
          <div className='max-w-63.25'>
            <Image src='/logo.png' alt='Stetsom' width={160} height={49} className='object-contain' />
            <p className='mt-4 text-sm leading-5 text-text-subtle-dark'>
              Potência sem limite desde 1989. Fabricamos os melhores amplificadores automotivos do Brasil.
            </p>

            <div className='mt-4 flex items-center gap-3'>
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className='flex h-9 w-9 items-center justify-center rounded border border-white/10 text-text-subtle-dark transition-colors hover:text-white'>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map(({ title, links }) => (
            <div key={title} className='flex min-w-32 flex-col gap-3'>
              <span className='mb-1 font-sans-condensed text-sm font-bold uppercase text-white'>{title}</span>
              {links.map(({ label, href }) => (
                <Link
                  key={label || href}
                  href={href}
                  className='text-sm text-text-subtle-dark transition-colors hover:text-white'>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className='flex flex-col gap-3 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between'>
          <span className='text-button-md text-text-subtle-dark'>
            ©2026 Stetsom Eletrônica Ltda. Todos os direitos reservados.
          </span>

          <div className='flex flex-wrap items-center gap-y-1 text-button-md text-text-subtle-dark'>
            {COPYRIGHT_LINKS.map(({ label, href }, index) => (
              <div key={label} className='flex items-center'>
                {index > 0 ? <span className='px-2'>|</span> : null}
                <Link href={href} className='transition-colors hover:text-white'>
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
