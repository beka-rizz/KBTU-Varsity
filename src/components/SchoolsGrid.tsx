import { SCHOOLS, type School } from '../data/schools'
import { SchoolLogo } from './SchoolLogo'

export function SchoolsGrid({ selected, onSelect }: { selected: School; onSelect: (s: School) => void }) {
  return (
    <section id="schools" className="cv-auto scroll-mt-16 border-t border-line bg-cream/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">02 — Школы</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-5xl">У каждой школы свой цвет.</h2>
          <p className="mt-4 text-ink/65">
            Цвет и эмблема закреплены за школой КБТУ — от жжёного оранжевого у энергетиков до чёрного с золотом у
            бизнес-школы. Классический тёмно-синий — для всех.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SCHOOLS.map((s, i) => {
            const active = s.id === selected.id
            return (
              <li key={s.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <button
                  type="button"
                  onClick={() => onSelect(s)}
                  aria-pressed={active}
                  className={`group relative flex h-full w-full flex-col overflow-hidden rounded-[26px] text-left ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-float ${
                    active ? 'ring-ink shadow-float' : 'ring-ink/10 shadow-card'
                  }`}
                  style={{ background: s.body, color: s.onBody }}
                >
                  {/* Jacket silhouette watermark */}
                  <svg
                    viewBox="0 0 200 220"
                    className="pointer-events-none absolute -right-8 -top-6 h-44 w-44 opacity-[0.14] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <path d="M60 30c10-14 70-14 80 0l30 12 10 60-24 6-6 90H50l-6-90-24-6 10-60z" fill="currentColor" />
                  </svg>

                  <div className="flex items-start justify-between p-5">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                      <SchoolLogo school={s} size={22} strokeWidth={2} />
                    </span>
                    <span className="font-display text-4xl leading-none opacity-90">{s.mark}</span>
                  </div>

                  <div className="mt-auto p-5 pt-10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">{s.backLine}</p>
                    <h3 className="mt-1 text-lg font-bold leading-tight">{s.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-snug opacity-80">{s.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] opacity-90">
                      {active ? 'Выбрано' : 'Смотреть в 3D'}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
