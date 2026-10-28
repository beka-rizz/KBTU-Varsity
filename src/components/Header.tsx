import { useEffect, useState } from 'react'
import { useCart } from '../store/cart'

const NAV = [
  { href: '#studio', label: 'Студия' },
  { href: '#schools', label: 'Школы' },
  { href: '#craft', label: 'Пошив' },
  { href: '#faq', label: 'Предзаказ' },
]

export function Header() {
  const { count, setOpen } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled ? 'bg-paper/85 backdrop-blur-md border-b border-line shadow-[0_1px_0_rgb(11_36_71/0.04)]' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-3" aria-label="КБТУ Варсити, на главную">
          <span
            className="school-transition grid h-9 w-9 place-items-center rounded-lg font-display text-lg leading-none text-[var(--school-ink)]"
            style={{ background: 'var(--school)' }}
          >
            К
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[13px] tracking-wide sm:text-[15px]">КБТУ ВАРСИТИ</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Зима · Алматы</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative inline-flex h-10 items-center gap-2 rounded-full border border-line bg-cream px-4 text-sm font-semibold shadow-sm transition hover:-translate-y-px hover:shadow-card"
          aria-label={`Открыть корзину, товаров: ${count}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="hidden sm:inline">Корзина</span>
          {count > 0 && (
            <span
              className="school-transition grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold text-[var(--school-ink)]"
              style={{ background: 'var(--school)' }}
            >
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
