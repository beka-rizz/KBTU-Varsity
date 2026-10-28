import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { PERSONALIZATION_KZT, PRICE_KZT, SCHOOLS, SIZES, formatKZT, type School, type Size } from '../data/schools'
import { useCart } from '../store/cart'
import { SchoolLogo } from './SchoolLogo'

const JacketScene = lazy(() => import('../three/JacketScene'))

// Kick off the 3D chunk download when the browser is idle, so it is usually
// cached by the time the user scrolls to the studio.
let prefetched = false
function prefetchScene() {
  if (prefetched) return
  prefetched = true
  const run = () => void import('../three/JacketScene')
  if ('requestIdleCallback' in window) (window as Window).requestIdleCallback(run, { timeout: 3000 })
  else setTimeout(run, 1200)
}

type View = 'auto' | 'front' | 'back'

export function Studio({ school, onSelect }: { school: School; onSelect: (s: School) => void }) {
  const { add } = useCart()
  const [size, setSize] = useState<Size>('M')
  const [name, setName] = useState('')
  const [view, setView] = useState<View>('auto')
  const [near, setNear] = useState(false) // within 600px → mount the scene
  const [visible, setVisible] = useState(true) // on screen → run the frameloop
  const stageRef = useRef<HTMLDivElement>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    prefetchScene()
    const el = stageRef.current
    if (!el) return
    const nearObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          nearObs.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
    nearObs.observe(el)
    visObs.observe(el)
    const onVis = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => {
      nearObs.disconnect()
      visObs.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const price = PRICE_KZT + (name.trim() ? PERSONALIZATION_KZT : 0)

  const handleAdd = () => {
    add({ schoolId: school.id, size, name: name.trim() || undefined })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <section id="studio" className="scroll-mt-16 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">01 — Студия</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">Выбери школу. Покрути в 3D.</h2>
          </div>
          <p className="max-w-sm text-sm text-ink/60">
            Куртка собирается на лету: шевроны, полоски и печать рисуются под выбранную школу. Потяни, чтобы повернуть.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* -------- 3D stage -------- */}
          <div
            ref={stageRef}
            className="school-transition relative overflow-hidden rounded-[32px] ring-1 ring-ink/10"
            style={{
              background: `radial-gradient(120% 90% at 50% 110%, color-mix(in oklab, var(--school) 32%, var(--color-paper-2)) 0%, var(--color-paper-2) 60%)`,
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-5">
              <div className="flex items-center gap-3 rounded-full bg-paper/85 py-1.5 pl-1.5 pr-4 shadow-sm backdrop-blur">
                <span
                  className="school-transition grid h-8 w-8 place-items-center rounded-full text-[var(--school-ink)]"
                  style={{ background: 'var(--school)' }}
                >
                  <SchoolLogo school={school} size={16} strokeWidth={2.2} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold">{school.short}</p>
                  <p className="text-[11px] font-medium text-muted">{school.name}</p>
                </div>
              </div>
              <span className="hidden rounded-full bg-paper/85 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70 shadow-sm backdrop-blur sm:inline-flex">
                3D вживую
              </span>
            </div>

            <div className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/4.4]">
              {near ? (
                <Suspense fallback={<StageSkeleton />}>
                  <JacketScene
                    school={school}
                    view={view}
                    active={visible}
                    className="h-full w-full"
                  />
                </Suspense>
              ) : (
                <StageSkeleton />
              )}
            </div>

            {/* View controls */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2 p-5">
              <div className="inline-flex rounded-full bg-paper/90 p-1 shadow-card backdrop-blur">
                {(
                  [
                    ['front', 'Спереди'],
                    ['back', 'Сзади'],
                    ['auto', 'Вращение'],
                  ] as const
                ).map(([v, label]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                      view === v ? 'bg-ink text-cream shadow' : 'text-ink/70 hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* -------- Controls -------- */}
          <div className="flex flex-col gap-7">
            <fieldset>
              <legend className="mb-3 flex w-full items-baseline justify-between text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Школа
                <span className="normal-case tracking-normal text-ink/50">12 расцветок</span>
              </legend>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {SCHOOLS.map((s) => {
                  const active = s.id === school.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSelect(s)}
                      aria-pressed={active}
                      className={`group flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all duration-300 ${
                        active
                          ? 'border-ink bg-cream shadow-card'
                          : 'border-line bg-cream/40 hover:-translate-y-0.5 hover:border-ink/40 hover:bg-cream'
                      }`}
                    >
                      <span
                        className="grid h-8 w-8 place-items-center rounded-lg text-white transition-transform group-hover:scale-105"
                        style={{ background: s.body, color: s.onBody }}
                      >
                        <SchoolLogo school={s} size={16} strokeWidth={2.2} />
                      </span>
                      <span className="line-clamp-2 text-[12px] font-bold leading-tight">{s.short}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 flex w-full items-baseline justify-between text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Размер
                <a href="#faq" className="normal-case tracking-normal text-ink/60 underline-offset-4 hover:underline">
                  Таблица размеров
                </a>
              </legend>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`h-11 min-w-14 rounded-full border px-4 text-sm font-bold transition ${
                      size === s ? 'border-ink bg-ink text-cream' : 'border-line bg-cream/40 hover:border-ink/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="name" className="mb-3 flex items-baseline justify-between text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                Имя на вышивке <span className="normal-case tracking-normal text-ink/50">по желанию · +{formatKZT(PERSONALIZATION_KZT)}</span>
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 14))}
                placeholder="например, АЙБЕК"
                autoComplete="off"
                className="h-12 w-full rounded-2xl border border-line bg-cream/60 px-4 font-semibold uppercase tracking-[0.12em] outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/35 focus:border-ink focus:bg-cream"
              />
              <p className="mt-2 text-xs text-ink/50">Вышьем на левой стороне груди под буквой. До 14 символов.</p>
            </div>

            <div className="mt-auto rounded-3xl border border-line bg-cream/60 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Итого</p>
                  <p className="mt-1 font-display text-3xl">{formatKZT(price)}</p>
                </div>
                <p className="text-right text-xs text-ink/55">
                  Задаток {formatKZT(10_000)} сейчас
                  <br />
                  остальное при получении
                </p>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="school-transition mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold text-[var(--school-ink)] shadow-float transition hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'var(--school)' }}
              >
                {added ? 'Добавлено ✓' : `В корзину · ${size}`}
              </button>
              <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-ink/60">
                <li className="rounded-xl bg-paper/70 py-2">Шерсть мельтон</li>
                <li className="rounded-xl bg-paper/70 py-2">Кожаные рукава</li>
                <li className="rounded-xl bg-paper/70 py-2">Стёганая подкладка</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StageSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-busy="true" aria-label="Загружаем 3D-куртку">
      <svg viewBox="0 0 200 220" className="h-[62%] w-auto animate-pulse-soft opacity-60" aria-hidden="true">
        <path
          d="M60 30c10-14 70-14 80 0l30 12 10 60-24 6-6 90H50l-6-90-24-6 10-60z"
          fill="var(--school)"
          opacity="0.85"
        />
        <path d="M30 42 18 102l26 6M170 42l12 60-26 6" fill="none" stroke="#f3eee3" strokeWidth="18" strokeLinecap="round" />
        <circle cx="128" cy="88" r="14" fill="#f3eee3" />
      </svg>
    </div>
  )
}
