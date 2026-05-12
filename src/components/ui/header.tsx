'use client'

import { NAV_LINKS, PRODUCT_MENU_CATEGORIES } from '@/lib/mock/navigation'
import { cn } from '@/lib/utils'
import { Menu, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container } from './container'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu'

export default function Header() {
  return (
    <header className='sticky top-0 z-50 h-22 w-full border-b border-zinc-200 bg-white'>
      <Container className='flex h-full items-center justify-between'>
        {/* Desktop header (unchanged layout) */}
        <div className='hidden md:flex items-center gap-[51px]'>
          <Link href='/'>
            <Image src='/logo.png' alt='Stetsom' width={158} height={35} priority />
          </Link>

          <div className='hidden md:block'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem className='hidden md:flex h-6 items-center'>
                  <NavigationMenuTrigger
                    nativeButton={false}
                    render={
                      <div className='p-0! h-6! flex items-center'>
                        <MenuLink href='/produtos' label='Produtos' />
                      </div>
                    }
                  />
                  <NavigationMenuContent>
                    <ul className='grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                      {PRODUCT_MENU_CATEGORIES.map((component) => (
                        <ListItem
                          key={component.label}
                          title={component.label}
                          href={component.href}
                          image={component.image}>
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink render={<MenuLink href={NAV_LINKS[1].href} label={NAV_LINKS[1].label} />} />
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink render={<MenuLink href={NAV_LINKS[2].href} label={NAV_LINKS[2].label} />} />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Mobile header: hamburger, centered logo, search */}
        <div className='flex items-center justify-between w-full md:hidden'>
          <div className='w-10 flex items-center justify-start'>
            <button aria-label='Abrir menu' className='inline-flex items-center justify-center w-10 h-10'>
              <Menu size={22} color='var(--color-icon-muted)' />
            </button>
          </div>

          <Link href='/' className='shrink-0'>
            <Image src='/logo.png' alt='Stetsom' width={120} height={28} />
          </Link>

          <div className='w-10 flex items-center justify-end'>
            <button aria-label='Buscar' className='inline-flex items-center justify-center w-10 h-10'>
              <Search size={20} color='var(--color-icon-muted)' />
            </button>
          </div>
        </div>

        {/* Right side (desktop) */}
        <div className='hidden md:flex items-center'>
          <Link
            href='/garantia'
            className='inline-flex items-center justify-center h-10 px-6 bg-brand-dark text-white font-sans-condensed font-bold text-sm uppercase tracking-wide hover:bg-zinc-800 transition-colors'>
            Garantia
          </Link>
        </div>
      </Container>
    </header>
  )
}

function MenuLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()

  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        'font-semibold text-base pb-0.5 border-b-2 transition-colors mx-4',
        active ? 'text-brand border-brand' : 'text-brand-dark border-transparent hover:text-brand hover:border-brand',
      )}>
      {label}
    </Link>
  )
}

function ListItem({
  title,
  children,
  href,
  image,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string; image: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href}>
            <div className='flex gap-3'>
              <div
                className='size-16 rounded-sm shrink-0 bg-cover bg-center'
                style={{ backgroundImage: `url('${image}')` }}
              />
              <div className='flex flex-col gap-1 text-sm flex-1'>
                <div className='leading-none font-medium'>{title}</div>
                <div className='line-clamp-2 text-muted-foreground'>{children}</div>
              </div>
            </div>
          </Link>
        }
      />
    </li>
  )
}
