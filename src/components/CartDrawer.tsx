import { useEffect, useState, type FormEvent } from 'react'
import { SCHOOL_BY_ID, formatKZT } from '../data/schools'
import { itemPrice, useCart } from '../store/cart'
import { SchoolLogo } from './SchoolLogo'

const DEPOSIT = 10_000

export default function CartDrawer() {
  const cart = useCart()
  const [stage, setStage] = useState<'bag' | 'checkout' | 'done'>('bag')
  const [orderId, setOrderId] = useState('')

  // Close on Escape, lock scroll while open
  useEffect(() => {
    if (!cart.open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cart.setOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [cart.open, cart])

  useEffect(() => {
    if (!cart.open && stage !== 'done') setStage('bag')
  }, [cart.open, stage])

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const id = `KV-${Date.now().toString(36).toUpperCase().slice(-6)}`
    setOrderId(id)
    setStage('done')
    cart.clear()
  }

  const close = () => {
    cart.setOpen(false)
    if (stage === 'done') setStage('bag')
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${cart.open ? '' : 'pointer-events-none'}`}
      aria-hidden={!cart.open}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 ${cart.open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-float transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] ${
          cart.open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-xl">
            {stage === 'bag' ? 'Корзина' : stage === 'checkout' ? 'Бронь' : 'Готово'}
            {stage === 'bag' && cart.count > 0 && <span className="ml-2 text-sm text-muted">({cart.count})</span>}
          </h2>
          <button
            type="button"
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-full border border-line hover:bg-cream"
            aria-label="Закрыть"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        {stage === 'bag' && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-2xl text-ink/70">Пока пусто</p>
                  <p className="mt-2 max-w-xs text-sm text-ink/55">Выбери школу в студии и добавь свой размер.</p>
                  <a
                    href="#studio"
                    onClick={close}
                    className="mt-6 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream"
                  >
                    В студию
                  </a>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.items.map((item) => {
                    const s = SCHOOL_BY_ID[item.schoolId]
                    return (
                      <li key={item.key} className="flex gap-4 rounded-2xl border border-line bg-cream/50 p-3">
                        <span
                          className="grid h-16 w-14 shrink-0 place-items-center rounded-xl"
                          style={{ background: s.body, color: s.onBody }}
                        >
                          <SchoolLogo school={s} size={22} strokeWidth={2} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold">{s.short}</p>
                          <p className="text-xs text-ink/60">
                            Размер {item.size}
                            {item.name ? ` · "${item.name}"` : ''}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-line">
                              <button
                                type="button"
                                onClick={() => cart.setQty(item.key, item.qty - 1)}
                                className="h-7 w-7 text-sm hover:bg-cream"
                                aria-label="Уменьшить количество"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => cart.setQty(item.key, item.qty + 1)}
                                className="h-7 w-7 text-sm hover:bg-cream"
                                aria-label="Увеличить количество"
                              >
                                +
                              </button>
                            </div>
                            <p className="text-sm font-bold">{formatKZT(itemPrice(item) * item.qty)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => cart.remove(item.key)}
                          className="self-start text-xs font-semibold text-ink/40 hover:text-ink"
                          aria-label="Удалить"
                        >
                          ✕
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            {cart.items.length > 0 && (
              <footer className="border-t border-line px-6 py-5">
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Итого</span>
                  <span className="font-bold">{formatKZT(cart.total)}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-ink/60">Задаток сегодня</span>
                  <span className="font-bold">{formatKZT(DEPOSIT * cart.count)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStage('checkout')}
                  className="school-transition mt-4 w-full rounded-full py-4 text-sm font-bold text-[var(--school-ink)] shadow-float"
                  style={{ background: 'var(--school)' }}
                >
                  Забронировать · {formatKZT(DEPOSIT * cart.count)}
                </button>
              </footer>
            )}
          </>
        )}

        {stage === 'checkout' && (
          <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto px-6 py-5">
            <p className="text-sm text-ink/65">
              Оставь контакты — пришлём ссылку Kaspi на задаток и подтвердим время примерки.
            </p>
            <div className="mt-5 space-y-4">
              <Field label="Имя и фамилия" name="fullName" placeholder="Айбек Сериков" required />
              <Field label="Телефон" name="phone" type="tel" placeholder="+7 7__ ___ __ __" required inputMode="tel" />
              <Field label="Telegram" name="telegram" placeholder="@username" />
              <Field label="ID студента КБТУ" name="studentId" placeholder="Необязательно — для примерки в кампусе" />
            </div>
            <div className="mt-auto pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-ink/60">Задаток</span>
                <span className="font-bold">{formatKZT(DEPOSIT * cart.count)}</span>
              </div>
              <button
                type="submit"
                className="school-transition mt-3 w-full rounded-full py-4 text-sm font-bold text-[var(--school-ink)] shadow-float"
                style={{ background: 'var(--school)' }}
              >
                Подтвердить бронь
              </button>
              <button
                type="button"
                onClick={() => setStage('bag')}
                className="mt-2 w-full py-2 text-sm font-semibold text-ink/60 hover:text-ink"
              >
                Назад в корзину
              </button>
            </div>
          </form>
        )}

        {stage === 'done' && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span
              className="school-transition grid h-16 w-16 place-items-center rounded-full text-[var(--school-ink)]"
              style={{ background: 'var(--school)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="mt-5 font-display text-2xl">Ты в партии</p>
            <p className="mt-2 text-sm text-ink/65">
              Заказ <span className="font-bold text-ink">{orderId}</span>. В течение дня напишем со ссылкой на оплату и
              временем примерки.
            </p>
            <button type="button" onClick={close} className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-bold text-cream">
              Готово
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-2xl border border-line bg-cream/60 px-4 font-medium outline-none transition placeholder:text-ink/35 focus:border-ink focus:bg-cream"
      />
    </label>
  )
}
