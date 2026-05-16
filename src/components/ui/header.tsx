'use client'

import { NAV_LINKS, PRODUCT_MENU_CATEGORIES } from '@/lib/mock/navigation'
import { cn } from '@/lib/utils'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import Link from 'next/link'
import { Logo } from './logo'
import { usePathname, useRouter } from 'next/navigation'
import { Container } from './container'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu'
import { FormEvent, useEffect, useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setSearchOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className='sticky top-0 z-50 h-22 w-full border-b border-border bg-white'>
        <Container className='flex h-full items-center justify-between'>
          {/* Desktop header */}
          <div className='hidden md:flex items-center gap-logo-nav'>
            <Link href='/'>
              <Logo width={158} height={35} priority />
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem className='hidden md:flex h-6 items-center'>
                  <NavigationMenuTrigger
                    className='p-0! m-0! h-auto! rounded-none! bg-transparent! hover:bg-transparent! focus:bg-transparent! data-popup-open:bg-transparent! data-open:bg-transparent! data-popup-open:hover:bg-transparent! data-open:hover:bg-transparent! data-open:focus:bg-transparent!'
                    nativeButton={false}
                    render={
                      <div className='flex items-center'>
                        <MenuLink href='/produtos' label='Produtos' />
                      </div>
                    }
                  />
                  <NavigationMenuContent>
                    <ul className='grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150'>
                      {PRODUCT_MENU_CATEGORIES.map((cat) => (
                        <ListItem key={cat.label} title={cat.label} href={cat.href} image={cat.image}>
                          {cat.description}
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

          {/* Mobile header: hamburger | logo | search */}
          <div className='flex items-center justify-between w-full md:hidden'>
            {searchOpen ? (
              <MobileSearchBar onClose={() => setSearchOpen(false)} />
            ) : (
              <>
                <div className='w-10 flex items-center justify-start'>
                  <button
                    aria-label='Abrir menu'
                    aria-expanded={mobileMenuOpen}
                    aria-controls='mobile-menu'
                    className='inline-flex items-center justify-center w-10 h-10 text-icon-muted'
                    onClick={() => setMobileMenuOpen(true)}>
                    <Menu size={22} />
                  </button>
                </div>

                <Link href='/' className='shrink-0'>
                  <Logo width={120} height={28} />
                </Link>

                <div className='w-10 flex items-center justify-end'>
                  <button
                    aria-label='Buscar'
                    className='inline-flex items-center justify-center w-10 h-10 text-icon-muted'
                    onClick={() => setSearchOpen(true)}>
                    <Search size={20} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right side (desktop) — language selector */}
          <div className='hidden md:flex items-center'>
            <button
              type='button'
              className='flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand hover:text-brand-dark'>
              <BrFlag />
              <span className='font-sans font-semibold uppercase tracking-wide'>PT</span>
              <ChevronDown size={12} />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile backdrop */}
      <div
        aria-hidden='true'
        className={cn(
          'fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 md:hidden',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <nav
      id='mobile-menu'
      role='dialog'
      aria-modal='true'
      aria-label='Menu de navegação'
      className={cn(
        'fixed left-0 top-0 z-[60] flex h-full w-4/5 max-w-xs flex-col bg-brand-dark transition-transform duration-300 md:hidden',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
      {/* Drawer header */}
      <div className='flex items-center justify-between border-b border-white/10 px-5 py-5'>
        <Link href='/' onClick={onClose}>
          <Logo variant='dark' width={120} height={28} />
        </Link>
        <button
          aria-label='Fechar menu'
          className='inline-flex items-center justify-center w-10 h-10 text-text-subtle-dark transition-colors hover:text-white'
          onClick={onClose}>
          <X size={22} />
        </button>
      </div>

      {/* Nav links */}
      <div className='flex flex-1 flex-col overflow-y-auto px-5 py-6'>
        {/* Produtos com accordion de categorias */}
        <div className='border-b border-white/10'>
          <button
            onClick={() => setCategoriesOpen((o) => !o)}
            className='flex w-full items-center justify-between py-4 font-sans-condensed font-black uppercase text-xl text-white transition-colors hover:text-brand'>
            Produtos
            <ChevronDown
              size={18}
              className={cn(
                'text-text-subtle-dark transition-transform duration-200',
                categoriesOpen && 'rotate-180',
              )}
            />
          </button>

          <div className={cn('overflow-hidden transition-all duration-300', categoriesOpen ? 'max-h-96' : 'max-h-0')}>
            <div className='flex flex-col pb-4 pl-4'>
              {PRODUCT_MENU_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  onClick={onClose}
                  className='py-2.5 font-sans text-sm text-text-subtle-dark transition-colors hover:text-white'>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sobre nós e Suporte */}
        {NAV_LINKS.slice(1).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              'border-b border-white/10 py-4 font-sans-condensed font-black uppercase text-xl transition-colors',
              pathname === link.href || pathname.startsWith(link.href + '/')
                ? 'text-brand'
                : 'text-white hover:text-brand',
            )}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Drawer footer — language selector */}
      <div className='border-t border-white/10 px-5 py-5'>
        <button
          type='button'
          className='flex items-center gap-1.5 rounded border border-white/20 px-3 py-1.5 text-xs font-medium text-text-subtle-dark transition-colors hover:border-brand hover:text-white'>
          <BrFlag />
          <span className='font-sans font-semibold uppercase tracking-wide'>PT</span>
          <ChevronDown size={12} />
        </button>
      </div>
    </nav>
  )
}

// ─── Mobile Search Bar ────────────────────────────────────────────────────────

function MobileSearchBar({ onClose }: { onClose: () => void }) {
  const router = useRouter()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = (new FormData(e.currentTarget).get('q') as string).trim()
    if (q) router.push(`/produtos?q=${encodeURIComponent(q)}`)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className='flex w-full items-center gap-2'>
      <input
        name='q'
        type='search'
        autoFocus
        placeholder='Buscar produtos...'
        className='flex-1 border-b border-border bg-transparent py-1 font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground'
      />
      <button
        type='button'
        aria-label='Fechar busca'
        className='inline-flex items-center justify-center w-10 h-10 text-icon-muted'
        onClick={onClose}>
        <X size={20} />
      </button>
    </form>
  )
}

// ─── Desktop Sub-components ───────────────────────────────────────────────────

function MenuLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        'font-sans font-normal text-lg pb-0.5 border-b-2 transition-colors mx-4',
        active
          ? 'text-brand border-brand'
          : 'text-muted-foreground border-transparent hover:text-brand hover:border-brand',
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

function BrFlag() {
  return (
    <svg width='16' height='12' viewBox='0 0 16 12' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <rect width='16' height='12' rx='1' fill='#009C3B' />
      <path d='M8 1.5L14.5 6L8 10.5L1.5 6L8 1.5Z' fill='#FEDF00' />
      <circle cx='8' cy='6' r='2.4' fill='#002776' />
    </svg>
  )
}
